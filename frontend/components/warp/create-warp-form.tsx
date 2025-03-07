"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useCreateWarp } from "@/hooks/createWarp";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  preview: z.string().url({
    message: "Please enter a valid URL for the preview image.",
  }),
  contractAddress: z.string({
    message: "Please enter a valid Ethereum contract address.",
  }),
  abi: z.any(),
});

export function CreateWarpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { mutateAsync } = useCreateWarp();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      preview: "",
      contractAddress: "",
      abi: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsSubmitting(true);

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    await mutateAsync(values);

    console.log(values);
    // setIsSubmitting(false);

    toast({
      title: "Warp Created!",
      description: "Your warp has been successfully created.",
      duration: 5000,
    });

    form.reset();
    setPreviewImage(null);
  }

  // Handle preview image change
  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewImage(url);
    form.setValue("preview", url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-[70%] m-auto">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="technical">Technical Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter warp name" {...field} />
                          </FormControl>
                          <FormDescription>The internal name for your warp.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter display title" {...field} />
                          </FormControl>
                          <FormDescription>The title displayed on the warp card.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter warp description" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormDescription>A brief description of what this warp does.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preview"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preview Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input placeholder="Enter image URL" onChange={handlePreviewChange} value={field.value} />

                            {previewImage && (
                              <div className="relative aspect-[2/1] w-full max-w-md overflow-hidden rounded-lg border">
                                <img
                                  src={previewImage || "/placeholder.svg"}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                  onError={() => setPreviewImage(null)}
                                />
                              </div>
                            )}

                            {!previewImage && (
                              <div className="flex aspect-[2/1] w-full max-w-md items-center justify-center rounded-lg border border-dashed">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                  <Upload className="h-8 w-8" />
                                  <span>Enter a URL to see preview</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>URL for the warp preview image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="technical" className="space-y-6 pt-4">
                  <FormField
                    control={form.control}
                    name="contractAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormDescription>The Ethereum contract address for this warp.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="abi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract ABI</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste contract ABI JSON here" className="min-h-[300px] font-mono text-sm" {...field} />
                        </FormControl>
                        <FormDescription>The ABI (Application Binary Interface) for the contract in JSON format.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Warp"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
