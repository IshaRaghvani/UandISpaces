"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // Add this import
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerDemo } from "@/components/ui/DatePickerDemo"; // Import the DatePickerDemo component

import { useForm, Controller } from "react-hook-form";
import GlobalApi from "@/app/_services/GlobalApi";
import { LoaderIcon } from "lucide-react";

function AddNewLead() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [follow_up_date, setFollowUpDate] = useState(undefined);
  const { toast } = useToast(); 
  const [loading, setLoading] = useState(false);


  
  useEffect(() => {
    GetAllLeadsList();
  }, []);

  const GetAllLeadsList = () => {
    GlobalApi.GetAllLeads().then((resp) => {
      console.log(resp.data);
      setLeads(resp.data);
    });
  };

  const onSubmit = (data) => {
    setLoading(true);
    // Format the followUpDate to yyyy-mm-dd
    const formattedFollowUpDate = follow_up_date ? format(follow_up_date, "yyyy-MM-dd") : undefined;
  
    // Include formatted date in form data
    const formattedData = {
      ...data,
      follow_up_date: formattedFollowUpDate,
    };
  
    
    GlobalApi.CreateNewLead(formattedData).then(resp=>{
      console.log(formattedData);
      
      toast({
        title: "New Lead Added",
        description: `Lead for ${data.name} has been successfully added.`,
      });
      setOpen(false);
    })
  };
  
  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="outline">Add new Lead</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] p-6 md:p-8 lg:p-10 overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="py-2">
                    <Label className="text-black mb-2">Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        Name is required
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Phone No.</Label>
                    <Input
                      type="number"
                      placeholder="9872527131"
                      {...register("phone_number")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Email ID</Label>
                    <Input
                      type="text"
                      placeholder="JohnDoe@gmail.com"
                      {...register("email")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">City</Label>
                    <Input
                      type="text"
                      placeholder="Pune"
                      {...register("city")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Project Name</Label>
                    <Input
                      type="text"
                      placeholder="Building Name/ Area"
                      {...register("project_name")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Budget</Label>
                    <Input
                      type="text"
                      placeholder="12L"
                      {...register("budget")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Configuration</Label>
                    <Controller
                      name="configuration"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Configuration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1bhk">1bhk</SelectItem>
                            <SelectItem value="2bhk">2bhk</SelectItem>
                            <SelectItem value="3bhk">3bhk</SelectItem>
                            <SelectItem value="4bhk">4bhk</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.configuration && (
                      <span className="text-red-500 text-sm">
                        Configuration is required
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Possesison</Label>
                    <Input
                      type="text"
                      placeholder="12th Dec"
                      {...register("possession")}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Follow Up Date</Label>
                    <DatePickerDemo
                      onDateChange={setFollowUpDate}
                      selectedDate={follow_up_date}
                    />
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Requirement</Label>
                    <Controller
                      name="requirement"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Requirement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="End to End">
                              End to End
                            </SelectItem>
                            <SelectItem value="Only Furniture">
                              Only Furniture
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.requirement && (
                      <span className="text-red-500 text-sm">
                        Requirement is required
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Status</Label>
                    <RadioGroup defaultValue="warm">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="warm"
                          id="warm"
                          {...register("status", { required: true })}
                        />
                        <Label className="text-black" htmlFor="warm">
                          Warm
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="hot"
                          id="hot"
                          {...register("status", { required: true })}
                        />
                        <Label className="text-black" htmlFor="hot">
                          Hot
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="open"
                          id="open"
                          {...register("status", { required: true })}
                        />
                        <Label className="text-black" htmlFor="open">
                          Open
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="no requirement"
                          id="no-requirement"
                          {...register("status", { required: true })}
                        />
                        <Label className="text-black" htmlFor="no-requirement">
                          No Requirement
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.status && (
                      <span className="text-red-500 text-sm">
                        Status is required
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Lead Source</Label>
                    <Controller
                      name="lead_source"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Lead Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Advertisement">
                              Advertisement
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.leadSource && (
                      <span className="text-red-500 text-sm">
                        Lead Source is required
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    <Label className="text-black">Additional Notes</Label>
                    <Textarea
                      placeholder="Any additional information"
                      {...register("comments")}
                    />
                  </div>
                </div>
                <Button type="submit" disable={loading} className="mt-4 bg-blue-500 text-white">
                  
                  {loading?<LoaderIcon className="animate-spin"/> : "Save"}
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewLead;
