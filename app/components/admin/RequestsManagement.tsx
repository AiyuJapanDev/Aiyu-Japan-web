import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, XCircle, CreditCard, Truck } from "lucide-react";
import { RequestItem } from "@/types/dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RequestsManagementProps {
  requests: RequestItem[];
}

const RequestsManagement: React.FC<RequestsManagementProps> = ({
  requests,
}) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "received":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quote Requests</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="received">Received</option>
            <option value="shipped">Shipped</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{request.id}</h3>
                    <p className="text-sm text-gray-600">
                      {request.clientName}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(request.status)} flex-shrink-0`}
                  >
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Product:</span>{" "}
                    <span className="break-all">
                      {request.productUrl.substring(0, 40)}...
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Estimate:</span>{" "}
                    {request.estimatedCost}
                  </p>
                  {request.finalQuote && (
                    <p>
                      <span className="font-medium">Final:</span>{" "}
                      {request.finalQuote}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 mt-3">
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 flex-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Request ID</TableHead>
                    <TableHead className="min-w-[150px]">Client</TableHead>
                    <TableHead className="min-w-[200px]">Product</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Quote</TableHead>
                    <TableHead className="min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.clientName}</p>
                          <p className="text-sm text-gray-500">
                            {request.clientId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm break-all max-w-xs">
                            {request.productUrl}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {request.quantity}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            Est: {request.estimatedCost}
                          </p>
                          {request.finalQuote && (
                            <p className="text-sm font-medium">
                              Final: {request.finalQuote}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {request.status === "approved" && (
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          {(request.status === "paid" ||
                            request.status === "received") && (
                            <Button
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Final Quote Amount
              </label>
              <Input placeholder="¥5,500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                PayPal Invoice Link
              </label>
              <Input placeholder="https://paypal.me/..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Internal Notes
            </label>
            <Textarea placeholder="Admin notes (not visible to client)..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-green-500 hover:bg-green-600">
              Approve & Quote
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Mark as Paid
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600">
              Mark as Received
            </Button>
            <Button className="bg-gray-500 hover:bg-gray-600">
              Mark as Shipped
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsManagement;
