'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useToast } from '@/app/hooks/use-toast';
import type { PortfolioItem } from '@/app/lib/types';
import { PlusCircle, Trash2, Bot } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function PortfolioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', imageUrl: '' },
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user) {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().portfolio) {
          setPortfolio(docSnap.data().portfolio);
        }
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    const newItem: PortfolioItem = { ...values, id: uuidv4() };
    const updatedPortfolio = [...portfolio, newItem];
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { portfolio: updatedPortfolio }, { merge: true });
      setPortfolio(updatedPortfolio);
      toast({ title: 'Success', description: 'Portfolio item added.' });
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add item.' });
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    const updatedPortfolio = portfolio.filter(item => item.id !== id);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { portfolio: updatedPortfolio }, { merge: true });
      setPortfolio(updatedPortfolio);
      toast({ title: 'Success', description: 'Portfolio item deleted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete item.' });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mini Portfolio</h1>
          <p className="text-muted-foreground">Showcase your best work.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Fill in the details of your project below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Project Title" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your project..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit">Save Project</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
            <Bot className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : portfolio.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
            <h3 className="text-xl font-semibold">Your portfolio is empty</h3>
            <p className="text-muted-foreground mt-2">Add your first project to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video overflow-hidden rounded-md border">
                    <Image
                        src={item.imageUrl || 'https://placehold.co/600x400'}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="object-cover transition-transform hover:scale-105"
                        data-ai-hint="project screenshot"
                    />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
