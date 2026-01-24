"use client"

import { userNotificationProps } from "@/types/types"
import { useEffect, useState } from "react"
import { getNotification } from "../crud/select"
import { supabase } from "@/lib/supabase/supabaseServer"

export function useRealtimeNotification(){
    const [notification, setNotification] = useState<userNotificationProps[]| null>(null)

    useEffect(() => {
        getNotification().then((data) => {
                if(data && data.length > 0){
                setNotification(data)
                }
                if(!data){
                  return
                }
              })
        const channels = supabase.channel('notification-realtime').on("postgres_changes",{event: '*', schema: 'public', table: 'notification'},
            (payload) => {
                setNotification((prev) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotif = payload.new as userNotificationProps;
                        return prev ? [...prev, newNotif] : [newNotif];
                    }

                    if (payload.eventType === 'UPDATE'){
                        const newNotif = payload.new as userNotificationProps
                        return prev ? prev.map((n) => n.id === newNotif.id ? newNotif : n) : prev;
                    }
                    if (payload.eventType === 'DELETE'){
                        const deletedNotif = payload.old as userNotificationProps
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

    return notification
}