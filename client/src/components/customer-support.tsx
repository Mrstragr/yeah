import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
  Bot,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: string;
  isRead: boolean;
}

interface Ticket {
  id: number;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface CustomerSupportProps {
  user: any;
}

export function CustomerSupport({ user }: CustomerSupportProps) {
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch user tickets
  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["/api/support/tickets", user?.id],
    enabled: !!user,
  });

  // Fetch FAQ
  const { data: faqs = [] } = useQuery<FAQ[]>({
    queryKey: ["/api/support/faq"],
  });

  // Fetch live chat messages
  const { data: chatMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/support/chat", user?.id],
    enabled: !!user && isLiveChatOpen,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Create ticket mutation
  const createTicket = useMutation({
    mutationFn: (ticketData: any) => apiRequest("POST", "/api/support/tickets", ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setNewTicket({ subject: "", category: "", priority: "medium", description: "" });
    },
  });

  // Send chat message mutation
  const sendChatMessage = useMutation({
    mutationFn: (message: string) => apiRequest("POST", "/api/support/chat", { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/chat"] });
      setChatMessage("");
    },
  });

  // Mark FAQ as helpful
  const markFAQHelpful = useMutation({
    mutationFn: (faqId: number) => apiRequest("POST", `/api/support/faq/${faqId}/helpful`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/faq"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'resolved': return 'bg-green-600';
      case 'closed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-orange-600';
      case 'urgent': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim() || !newTicket.category) {
      return;
    }
    createTicket.mutate(newTicket);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    sendChatMessage.mutate(chatMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Customer Support</h1>
          <p className="text-gray-300">Get help with your account and gaming experience</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 cursor-pointer hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
              <Button 
                onClick={() => setIsLiveChatOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-400 text-sm mb-4">Call us for urgent issues</p>
              <p className="text-green-400 font-bold">+91-9999-888-777</p>
              <p className="text-gray-500 text-xs">24/7 Available</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm mb-4">Send us detailed queries</p>
              <p className="text-purple-400 font-bold">support@tashanwin.com</p>
              <p className="text-gray-500 text-xs">Response within 2 hours</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="faq" className="data-[state=active]:bg-purple-600">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-purple-600">
              My Tickets ({tickets.length})
            </TabsTrigger>
            <TabsTrigger value="create-ticket" className="data-[state=active]:bg-purple-600">
              Create Ticket
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-300 mb-4">{faq.answer}</p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-purple-600">{faq.category}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">{faq.helpful} found this helpful</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markFAQHelpful.mutate(faq.id)}
                          className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                        >
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg mb-2">#{ticket.id} - {ticket.subject}</h3>
                          <p className="text-gray-400 text-sm">{ticket.description.substring(0, 150)}...</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                          <span>Category: {ticket.category}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-12 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2">No Support Tickets</h3>
                  <p className="text-gray-400 mb-6">You haven't created any support tickets yet</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Create Ticket Tab */}
          <TabsContent value="create-ticket" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Category</label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="payment">Payment & Withdrawal</SelectItem>
                        <SelectItem value="technical">Technical Problems</SelectItem>
                        <SelectItem value="games">Game-related Issues</SelectItem>
                        <SelectItem value="security">Security Concerns</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Priority</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="medium">Medium - Standard issue</SelectItem>
                      <SelectItem value="high">High - Affects functionality</SelectItem>
                      <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <Button
                  onClick={handleCreateTicket}
                  disabled={createTicket.isPending || !newTicket.subject.trim() || !newTicket.description.trim()}
                  className="bg-green-600 hover:bg-green-700 w-full py-3"
                >
                  {createTicket.isPending ? "Creating..." : "Create Ticket"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Live Chat Widget */}
        {isLiveChatOpen && (
          <div className={`fixed bottom-4 right-4 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 ${isMinimized ? 'h-16' : 'h-96'} transition-all duration-300`}>
            {/* Chat Header */}
            <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">Live Support</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-purple-700 p-1"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsLiveChatOpen(false)}
                  className="text-white hover:bg-purple-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="p-4 h-72 overflow-y-auto bg-gray-900">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : message.sender === 'bot'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}>
                          <div className="flex items-center gap-1 mb-1">
                            {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            <span className="text-xs opacity-75">
                              {message.sender === 'user' ? 'You' : message.sender === 'bot' ? 'Bot' : 'Support'}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-50 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-gray-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[80vh] overflow-hidden">
              <CardHeader className="border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">Ticket #{selectedTicket.id}</CardTitle>
                    <p className="text-gray-400 mt-1">{selectedTicket.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Description</h4>
                    <p className="text-gray-300">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white ml-2">{selectedTicket.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Priority:</span>
                      <Badge className={`ml-2 ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white ml-2">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white ml-2">{new Date(selectedTicket.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedTicket.messages && selectedTicket.messages.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Messages</h4>
                      <div className="space-y-3">
                        {selectedTicket.messages.map((message) => (
                          <div key={message.id} className={`p-3 rounded-lg ${
                            message.sender === 'user' ? 'bg-purple-600/20' : 'bg-gray-700/50'
                          }`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white font-medium">
                                {message.sender === 'user' ? 'You' : 'Support Agent'}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300">{message.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}