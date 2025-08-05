'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { generateTagline } from '@/app/ai/flows/generate-tagline';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { Bot, Sparkles, Save, Mail, Phone, Globe } from 'lucide-react';
import type { UserProfile } from '@/app/lib/types';

const VisitingCardPreview = ({ profile, qrValue }: { profile: UserProfile, qrValue: string }) => (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card overflow-hidden">
        <div className="bg-primary/10 p-8">
            <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full h-20 w-20 flex items-center justify-center">
                    <Bot className="h-10 w-10"/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground">{profile.name || "Your Name"}</h2>
                    <p className="text-primary font-medium">{profile.tagline || "Your Professional Tagline"}</p>
                </div>
            </div>
        </div>
        <CardContent className="p-8 grid grid-cols-2 gap-8 items-center">
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground"/>
                    <span>{profile.email || "your.email@example.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground"/>
                    <span>{profile.contact?.phone || "+123 456 7890"}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground"/>
                    <span>{profile.contact?.website || "yourwebsite.com"}</span>
                </div>
            </div>
             <div className="flex justify-center items-center">
                <div className="p-2 border rounded-lg">
                    <QRCode value={qrValue} size={100} bgColor="var(--background)" fgColor="var(--foreground)" />
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function VisitingCardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const qrValue = useMemo(() => user ? `https://linkard.store/profile/${user.uid}` : 'https://linkard.store', [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setProfile({ ...docSnap.data(), email: user.email } as UserProfile);
        } else {
            setProfile({ email: user.email || '' });
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleGenerateTagline = async () => {
    if (!profile.about) {
      toast({ variant: 'destructive', title: 'Cannot generate tagline', description: 'Please fill out your "About Me" section first.' });
      return;
    }
    setGenerating(true);
    try {
      const result = await generateTagline({ aboutMe: profile.about });
      setProfile(p => ({ ...p, tagline: result.tagline }));
      toast({ title: 'Tagline Generated!', description: 'Your new tagline is ready.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate tagline.' });
    } finally {
      setGenerating(false);
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    const { email, ...profileData } = profile;
    try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, profileData, { merge: true });
        toast({ title: 'Success', description: 'Your visiting card details are saved.' });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save details.' });
    }
  };

  const handleInputChange = (field: 'phone' | 'website') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile(p => ({...p, contact: {...p.contact, [field]: e.target.value }}));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visiting Card</h1>
          <p className="text-muted-foreground">Customize your virtual business card.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Card Details</CardTitle><CardDescription>Update your contact info and generate a tagline.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Bot className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={profile.contact?.phone || ''} onChange={handleInputChange('phone')} placeholder="+123 456 7890"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" value={profile.contact?.website || ''} onChange={handleInputChange('website')} placeholder="yourwebsite.com"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <div className="flex gap-2">
                            <Input id="tagline" value={profile.tagline || ''} onChange={(e) => setProfile(p => ({ ...p, tagline: e.target.value }))} placeholder="Your Professional Tagline"/>
                            <Button variant="outline" onClick={handleGenerateTagline} disabled={generating}>
                                <Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`}/> {generating ? 'Generating...' : 'AI'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Save</Button>
                    </div>
                </>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Preview</h2>
        <VisitingCardPreview profile={profile} qrValue={qrValue} />
      </div>
    </div>
  );
}
