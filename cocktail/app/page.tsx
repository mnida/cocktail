"use client"

import { createOrder } from "./actions/order"
import React, { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const [name, setName] = useState("")
  const [selectedDrink, setSelectedDrink] = useState("")
  const [showLogo, setShowLogo] = useState(true)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [newOne, setNewOne] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const cocktails = [
    {
      name: "The Backend Engineer",
      description:
        "A refreshing cocktail made with matcha green tea, tequila, lime juice, and agave syrup",
      standard_name: "Matcha Margarita",
    },
    {
      name: "The Frontend Engineer",
      description:
        "A sophisticated cocktail made with premium tequila, fresh lime juice, and triple sec, served with a salted rim.",
      standard_name: "Matcha Martini",
    },
  ]

  const handleOrder = async () => {
    if (!name || !selectedDrink) {
      setError("Please fill in your name and drink name!")
      return
    }
    try {
      await createOrder(name, selectedDrink)

      setOrderSubmitted(true)
      setNewOne(false)
    } catch (error) {
      console.error("Error submitting request:", error)
    }
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {orderSubmitted && !newOne && (
        <>
          <Confetti />
          <div
            onClick={() => {
              console.log("test")
              setNewOne(true)
              setName("")
              setSelectedDrink("")
              setOrderSubmitted(false)
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: " 50%",
              transform: "translate(-50%, -50%)",
              backdropFilter: "blur(10px)",
              zIndex: 10000,
            }}
          >
            <img
              src='Group 1197133278.png'
              alt='bg'
              style={{ position: "relative", zIndex: 2 }}
            />
            <div
              style={{
                textAlign: "center",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: " 50%",
              }}
            >
              {`Thank you ${
                name.slice(0, 1).toUpperCase() + name.slice(1)
              }! Your ${selectedDrink} will be ready shortly.`}
              <Button style={{ marginTop: "10px", zIndex: 100000 }}>
                Order another one!
              </Button>
            </div>
          </div>
        </>
      )}
      {!orderSubmitted && newOne && (
        <>
          {showLogo && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: " 50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <video
                src='a_Wordmark_InAndOut.mp4'
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}
          {!showLogo && (
            <main
              className={`min-h-screen bg-gray-100 p-4 max-w-md mx-auto transition-opacity duration-1000 ${
                showLogo ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "30px",
                  columnGap: "20px",
                }}
              >
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 487 486'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M270.172 75L207.987 75.0002L76.5557 411.18H143.335L172.258 333.039H314.322L343.246 411.18H410.025L305.781 145.403H244.297L294.757 280.658H191.824L242.439 144.984L270.172 75Z'
                    fill='black'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M486.556 0V486H355.882V459.297H459.705V26.7033H355.882V0H486.556Z'
                    fill='black'
                  />
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M0.555466 0V486H131.229V459.297H27.4063V26.7033H131.229V0H0.555466Z'
                    fill='black'
                  />
                </svg>
                <h1 className='text-3xl font-bold text-center  text-gray-800'>
                  Cocktail Menu
                </h1>
              </div>
              <div className='space-y-4 mb-8'>
                {cocktails.map((cocktail) => (
                  <Card key={cocktail.name}>
                    <CardContent className='p-4'>
                      <h2 className='text-xl font-semibold mb-2'>
                        {cocktail.name}
                      </h2>
                      <h2 className='text-sm text-gray-500 font-semibold mb-2'>
                        {cocktail.standard_name}
                      </h2>
                      <p className='text-gray-600'>{cocktail.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className='fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg space-y-4'>
                <Select onValueChange={setSelectedDrink}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select your drink' />
                  </SelectTrigger>
                  <SelectContent>
                    {cocktails.map((cocktail) => (
                      <SelectItem
                        key={cocktail.standard_name}
                        value={cocktail.standard_name}
                      >
                        {cocktail.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder='Your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full'
                />

                <Button onClick={handleOrder} className='w-full'>
                  Place Order
                </Button>
                {error && <div style={{ textAlign: "center" }}>{error}</div>}
              </div>
            </main>
          )}
        </>
      )}
    </div>
  )
}
