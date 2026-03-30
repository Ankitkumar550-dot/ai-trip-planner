"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import React from 'react'

function ChatBox() {

    const onSend = () => {

    }
  return (
    <div className='h-[85vh] flex flex-col'>
        {/*Display Messages */}
        <section className='flex-1 overflow-y-auto p-4'>
            <div className='flex justify-end mt-2'>
                <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                    User Msg

                </div>
            </div>
            <div className='flex justify-start mt-2'>
                <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                    AI Agent Msg

                </div>
            </div>

        </section>
        {/* User Input */}
        <section>
            <div className="relative flex justify-center">
          <div className="w-full md:w-3/4 backdrop-blur-xl bg-white/70 dark:bg-neutral-800/60 border border-white/30 shadow-2xl rounded-3xl p-4">
            <Textarea
              placeholder="Create a 5-day trip to Paris from India..."
              className="w-full h-24 bg-transparent focus:outline-none resize-none"
            />
            <div className="flex justify-end">
              <Button size={'icon'} className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition" onClick={() =>onSend()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
            
        </section>
    </div>
  )
}

export default ChatBox