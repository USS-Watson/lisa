'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react"

export default function LoginForm() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        window.location.href = '/form'
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold">Login</h2>
                <p className="text-gray-500">Sign in with your university credentials</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="jdoe2@huskers.unl.edu" required type="email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" required type="password" />
                </div>
                <Button className="w-full" type="submit">
                    Sign in
                </Button>
            </form>
            {/* <div className="text-center text-sm">
            <a className="underline text-gray-500 hover:text-gray-700" href="#">
              Forgot your password?
            </a>
          </div> */}
        </div>
    )
}