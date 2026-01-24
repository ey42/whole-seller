"use client"

import { productProp, userNotificationProps, userProductProp } from "@/types/types"
import { useEffect, useState } from "react"
import { getNotification, getProducts } from "../crud/select"
import { supabase } from "@/lib/supabase/supabaseServer"

export function useRealtimeProducts(){ 
    const [product, setProduct] = useState<userProductProp[] | null>(null)

    useEffect(() => {
        getProducts().then((data) => {
                if(data && data.length > 0){
                setProduct(data)
                }
                if(!data){
                  return
                }
              })
        const channels = supabase.channel('notification-realtime').on("postgres_changes",{event: '*', schema: 'public', table: 'notification'},
            (payload) => {
                setProduct((prev) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotif = payload.new as userProductProp;
                        return prev ? [...prev, newNotif] : [newNotif];
                    }

                    if (payload.eventType === 'UPDATE'){
                        const newNotif = payload.new as userProductProp
                        return prev ? prev.map((n) => n.id === newNotif.id ? newNotif : n) : prev;
                    }
                    if (payload.eventType === 'DELETE'){
                        const deletedNotif = payload.old as userProductProp
                        return prev ? prev.filter((n) => n.id !== deletedNotif.id) : prev;
                    }
                    return prev;
                })
            }
        ).subscribe()
        return () => {
            supabase.removeChannel(channels)
        }
    }, [])

    return product
}