"use client"

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [name, setName] = useState('');
  const [selectedDrink, setSelectedDrink] = useState('');

  const cocktails = [
    {
      name: "The Backend Engineer",
      description: "A refreshing cocktail made with matcha green tea, tequila, lime juice, and agave syrup",
      price: "Matcha Margarita"
    },
    {
      name: "The Frontend Engineer",
      description: "A sophisticated cocktail made with premium tequila, fresh lime juice, and triple sec, served with a salted rim.",
      price: "Matcha Martini"
    }
  ];

  const handleOrder = () => {
    if (!name || !selectedDrink) {
      alert('Please fill in all fields');
      return;
    }
    alert(`Thank you ${name}! Your ${selectedDrink} will be ready shortly.`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Cocktail Menu</h1>
      
      <div className="space-y-4 mb-8">
        {cocktails.map((cocktail) => (
          <Card key={cocktail.name}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{cocktail.name}</h2>
              <h2 className="text-sm text-gray-500 font-semibold mb-2">{cocktail.price}</h2>
              <p className="text-gray-600">{cocktail.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg space-y-4">
        <Select onValueChange={setSelectedDrink}>
          <SelectTrigger>
            <SelectValue placeholder="Select your drink" />
          </SelectTrigger>
          <SelectContent>
            {cocktails.map((cocktail) => (
              <SelectItem key={cocktail.name} value={cocktail.name}>
                {cocktail.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />

        <Button 
          onClick={handleOrder}
          className="w-full"
        >
          Place Order
        </Button>
      </div>
    </main>
  );
}