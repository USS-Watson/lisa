'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Component() {
  const [selectedOption, setSelectedOption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append("option", selectedOption);
    if (file) {
      formData.append("file", file);
    }

    // Send POST request
    try {
      const response = await fetch('https://api-project3.apps.rosa.rosa-t8j8w.ft2c.p3.openshiftapps.com/documentUpload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form.');
    }

    //redirect to meeting
    window.location.href = "/zoom.html";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Lisa</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-gray-700">What do you want to talk about?</Label>
              <Select onValueChange={setSelectedOption} required>
                <SelectTrigger id="topic" className="bg-white border-gray-300">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="register">I would like to register for classes</SelectItem>
                  <SelectItem value="swap">I would like to swap classes</SelectItem>
                  <SelectItem value="chat">I would like to chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="file" className="text-gray-700">Upload Document (Optional)</Label>
              <p className="text-sm text-gray-400">Recommended file types: .pdf, .doc, .docx. Used to help Lisa determine appropriate recommendations.</p>
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
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-600">{fileName || 'No file chosen'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Join Virtual Meeting</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}