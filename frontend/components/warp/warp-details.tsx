"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Share2, Clock, ArrowRight, ChevronRight, Code, Settings2 } from "lucide-react";
import Image from "next/image";
import { Warp, WarpAction, WarpBuilder } from "@vleap/warps";
import { usePathname } from "next/navigation";

// Mock data for the warp
// const warpData = {
//   id: "warp-1",
//   name: "ESDT Token Manager",
//   description: "Create and manage ESDT tokens with advanced features",
//   image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-07%20161020-CKNDChRfkCASvj85KWU3ixRAPftVVL.png",
//   createdAt: "2025-03-07T10:12:14.000Z",
//   category: "Token",
//   actions: [
//     {
//       id: "action-1",
//       name: "issueEsdtToken",
//       description: "Issue a new ESDT token with custom properties",
//       params: [
//         { name: "tokenName", type: "string", description: "Name of the token" },
//         { name: "tokenTicker", type: "string", description: "Token ticker symbol" },
//         { name: "initialSupply", type: "number", description: "Initial token supply" },
//         { name: "decimals", type: "number", description: "Number of decimals" },
//       ],
//     },
//     {
//       id: "action-2",
//       name: "mintTokens",
//       description: "Mint additional tokens to an existing ESDT",
//       params: [
//         { name: "tokenIdentifier", type: "string", description: "Token identifier" },
//         { name: "amount", type: "number", description: "Amount to mint" },
//       ],
//     },
//     {
//       id: "action-3",
//       name: "burnTokens",
//       description: "Burn existing ESDT tokens",
//       params: [
//         { name: "tokenIdentifier", type: "string", description: "Token identifier" },
//         { name: "amount", type: "number", description: "Amount to burn" },
//       ],
//     },
//     {
//       id: "action-4",
//       name: "pauseTokens",
//       description: "Pause all transactions for an ESDT token",
//       params: [{ name: "tokenIdentifier", type: "string", description: "Token identifier" }],
//     },
//   ],
// };

export function WarpDetails() {
  const [selectedAction, setSelectedAction] = useState<WarpAction>();
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [warp, setWarp] = useState<Warp | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function getWarp() {
      const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

      const b = new WarpBuilder({
        env: "devnet",
        userAddress: "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger",
      });

      const data = await b.createFromTransactionHash(pathname.split("/")[2]);

      setWarp(data);
    }

    getWarp();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {warp && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{warp.name}</h1>
                <p className="text-muted-foreground">{warp.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(warp.meta?.createdAt ?? "")}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  {warp.meta?.hash}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-[2/1] w-full max-w-xl overflow-hidden rounded-lg border"
            >
              <Image src={warp.preview || "/placeholder.svg"} alt={warp.name} fill className="object-cover" />
            </motion.div>
          </div>

          {/* Actions Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
                <CardDescription>Execute various operations on your ESDT tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid" className="pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {warp.actions.map((action) => (
                        <Card key={action.description + action.label} className="group relative overflow-hidden">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{action.label}</span>
                              <Settings2 className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{action.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Parameters:</div>
                              <div className="space-y-1">
                                {action.inputs &&
                                  action.inputs.length > 0 &&
                                  action.inputs.map((param) => (
                                    <div key={param.name} className="text-sm">
                                      • <span className="font-medium">{param.name}</span>: {param.type}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </CardContent>
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
                          <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => setSelectedAction(action)}
                              >
                                Execute
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedAction && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Execute {selectedAction.label}</DialogTitle>
                                  <DialogDescription>{selectedAction.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {selectedAction.inputs &&
                                    selectedAction.inputs.length > 0 &&
                                    selectedAction.inputs.map((param) => (
                                      <div key={param.name} className="space-y-2">
                                        <Label htmlFor={param.name}>{param.name}</Label>
                                        <Input
                                          id={param.name}
                                          placeholder={`Enter ${param.name}`}
                                          type={param.type === "number" ? "number" : "text"}
                                        />
                                        <p className="text-xs text-muted-foreground">{param.description}</p>
                                      </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-4">
                                  <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => setIsActionDialogOpen(false)}>
                                    Execute Action
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="list" className="pt-4">
                    <div className="space-y-4">
                      {warp.actions.map((action) => (
                        <Card key={action.description + action.label}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="space-y-1">
                              <h3 className="font-medium">{action.label}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" onClick={() => setSelectedAction(action)}>
                                  Execute
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Execute {action.label}</DialogTitle>
                                  <DialogDescription>{action.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  {action?.inputs &&
                                    action.inputs.length > 0 &&
                                    action.inputs.map((param) => (
                                      <div key={param.name} className="space-y-2">
                                        <Label htmlFor={param.name}>{param.name}</Label>
                                        <Input
                                          id={param.name}
                                          placeholder={`Enter ${param.name}`}
                                          type={param.type === "number" ? "number" : "text"}
                                        />
                                        <p className="text-xs text-muted-foreground">{param.description}</p>
                                      </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-4">
                                  <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => setIsActionDialogOpen(false)}>
                                    Execute Action
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
}
