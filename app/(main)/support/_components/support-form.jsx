"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { sendSupportEmail } from "@/actions/support";

export function SupportForm({ userName, userEmail }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        priority: "medium",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject.trim()) {
            toast.error("Please enter a subject");
            return;
        }
        if (!formData.message.trim()) {
            toast.error("Please enter your message");
            return;
        }

        setLoading(true);
        try {
            await sendSupportEmail(formData);
            setSuccess(true);
            toast.success("Support request sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });
            setFormData({ subject: "", message: "", priority: "medium" });
        } catch (error) {
            toast.error(error.message || "Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                            Request Sent Successfully!
                        </h3>
                        <p className="text-green-700 mb-6">
                            We&apos;ve received your support request and will respond within 24 hours.
                        </p>
                        <Button
                            onClick={() => setSuccess(false)}
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                        >
                            Send Another Request
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Contact Support
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Info */}
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p className="text-gray-600">
                            Sending as: <span className="font-medium text-gray-900">{userName || userEmail}</span>
                        </p>
                        <p className="text-gray-500 text-xs">Reply will be sent to {userEmail}</p>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Priority Level
                        </label>
                        <Select
                            value={formData.priority}
                            onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        Low - General inquiry
                                    </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                        Medium - Need help soon
                                    </div>
                                </SelectItem>
                                <SelectItem value="high">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        High - Urgent issue
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Subject
                        </label>
                        <Input
                            placeholder="Brief description of your issue"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Message
                        </label>
                        <Textarea
                            placeholder="Describe your issue or question in detail..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={6}
                            disabled={loading}
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Support Request
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

