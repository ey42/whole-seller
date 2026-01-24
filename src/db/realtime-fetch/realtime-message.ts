"use client"

import { userMessageProps } from "@/types/types"
import { useEffect, useState } from "react"
import { getMessage} from "../crud/select"
import { supabase } from "@/lib/supabase/supabaseServer"

export function useRealtimeMessage(id:string){
    const [message, setMessage] = useState<userMessageProps[]| null>(null)

    useEffect(() => {
        getMessage(id).then((data) => {
                if(data){
                setMessage(data)
                
                }
                if(!data){
                  
                }
              })
        const channels = supabase.channel('message-realtime').on("postgres_changes",{event: '*', schema: 'public', table: 'notification'},
            (payload) => {
                setMessage((prev) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotif = payload.new as userMessageProps;
                        return prev ? [...prev, newNotif] : [newNotif];
                    }

                    if (payload.eventType === 'UPDATE'){
                        const newNotif = payload.new as userMessageProps
                        return prev ? prev.map((n) => n.id === newNotif.id ? newNotif : n) : prev;
                    }
                    if (payload.eventType === 'DELETE'){
                        const deletedNotif = payload.old as userMessageProps
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

    return message
}