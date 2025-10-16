import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Pencil, Upload, Shield, Activity, Settings } from "lucide-react"
import { useSelector } from "react-redux"

export default function ProfilePage() {

    const user = useSelector((state: any) => state.auth.user);

  return (
    <motion.div
      className="min-h-screen  px-4 py-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-4xl  border  shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-3 pb-0">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 ">
              <AvatarImage src="https://avatars.githubusercontent.com/u/9919?s=280&v=4" alt="profile" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full p-2 "
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          <CardTitle className="text-2xl font-semibold mt-2">{user.name}</CardTitle>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <Badge variant="outline" className="mt-1 border-slate-600 text-slate-300">
            Pro Member
          </Badge>
        </CardHeader>

        <CardContent className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className=" flex justify-center flex-wrap">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> Security
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 space-y-4">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className=" rounded-xl p-4">
                  <h4 className="text-slate-300 mb-1">Name</h4>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div className=" rounded-xl p-4">
                  <h4 className="text-slate-300 mb-1">Email</h4>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div className="sm:col-span-2  rounded-xl p-4">
                </div>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4 space-y-4">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    value={user.name}
                    placeholder="Your name"
                    className=" border-slate-700 "
                  />
                  <Input
                    value={user.email}
                    placeholder="Your email"
                    className=" border-slate-700 "
                  />
                </div>
            
                <div className="flex justify-end mt-4">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Pencil className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-4 space-y-4">
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <Card className=" border-slate-700">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="text-lg font-semibold">Change Password</h4>
                    <Input type="password" placeholder="Current password" className=" border-slate-700 " />
                    <Input type="password" placeholder="New password" className=" border-slate-700 " />
                    <Input type="password" placeholder="Confirm new password" className=" border-slate-700 " />
                    <Button className="bg-red-600 hover:bg-red-700 w-full mt-2">Update Password</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
