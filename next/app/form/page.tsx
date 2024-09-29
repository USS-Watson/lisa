'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function Component() {
  const [selectedOption, setSelectedOption] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()    
    //send post request to backend
    fetch("https://api-project3.apps.rosa.rosa-t8j8w.ft2c.p3.openshiftapps.com/documentUpload", {
      method: 'POST',
      body: new FormData(event.currentTarget as HTMLFormElement)
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Lisa</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-gray-300">What do you want to talk about?</Label>
              <Select onValueChange={setSelectedOption} required>
                <SelectTrigger id="topic" className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="register">I would like to register for classes</SelectItem>
                  <SelectItem value="swap">I would like to swap classes</SelectItem>
                  <SelectItem value="chat">I would like to chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="file" className="text-gray-300">Upload Document (Optional)</Label>
              <p className="text-sm text-gray-400">PDF, Word, or Excel files recommended. Used to help the AI advisor understand your needs.</p>
              <div className="flex items-center space-x-2">
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-gray-700 hover:bg-gray-600"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}