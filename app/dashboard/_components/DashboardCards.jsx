import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function DashboardCards({ totalLeads, hotLeads , todaysLeads}) {
  return (
    <div className="flex gap-4">
    {/* <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card> */}
    {/* total leads */}
    <Card className="w-[250px] bg-opacity-40 bg-purple-300 text-bold text-purple-700 ">
      <CardHeader>
        <CardTitle>Total Leads</CardTitle>
        <CardDescription>Total Leads for this month</CardDescription>
      </CardHeader>
      <CardContent>
      <CardTitle>{totalLeads}</CardTitle>
        
      </CardContent>
      
    </Card>
     {/* Hot leads */}
    <Card className="w-[250px] bg-opacity-40 bg-rose-300 text-bold text-rose-700 ">
      <CardHeader>
        <CardTitle>Hot Leads</CardTitle>
        <CardDescription>Hot Leads for this month</CardDescription>
      </CardHeader>
      <CardContent>
      <CardTitle>{hotLeads}</CardTitle>
        
      </CardContent>
      
    </Card>
    {/* Todays leads */}
    <Card className="w-[250px] bg-opacity-40 bg-green-300 text-bold text-green-700 ">
      <CardHeader>
        <CardTitle>Today's Leads</CardTitle>
        <CardDescription>Scheduled Leads for today</CardDescription>
      </CardHeader>
      <CardContent>
      <CardTitle>{todaysLeads}</CardTitle>
        
      </CardContent>
      
    </Card>
    </div>
  );
}

export default DashboardCards;
