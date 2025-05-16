"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // For demo purposes, accept any login
    // In a real app, you would validate against a backend
    localStorage.setItem("zk-cargo-pass-auth", "authenticated")
    localStorage.setItem("zk-cargo-pass-user", username)

    router.push("/dashboard")
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    if (isSignUp && !name) {
      setError("Please enter your name")
      return
    }

    // For demo purposes, accept any sign-up
    // In a real app, you would send this data to a backend
    localStorage.setItem("zk-cargo-pass-auth", "authenticated")
    localStorage.setItem("zk-cargo-pass-user", username)
    localStorage.setItem("zk-cargo-pass-name", name)

    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Sign Up for zkCargoPass" : "Login to zkCargoPass"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? "Create an account to access the dashboard" : "Enter your credentials to access the dashboard"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">{error}</div>}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full bg-[#3C3FB4] hover:bg-[#1A2A5E]">
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </CardFooter>
        </form>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center">
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
