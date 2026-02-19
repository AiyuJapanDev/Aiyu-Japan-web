import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Eye, Globe } from "lucide-react";
import { UserRole, UserWithRole } from "@/types/user";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInfoDialog } from "./UserInfoDialog";

interface UserManagementProps {
  users: UserWithRole[];
  usersLoading: boolean;
  refetchUsers: () => void;
  handleRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  usersLoading,
  refetchUsers,
  handleRoleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenUserInfo = (user: UserWithRole) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_personal_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "moderator":
        return "bg-yellow-100 text-yellow-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10 w-full sm:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => refetchUsers()}
            disabled={usersLoading}
            className="flex-shrink-0"
          >
            {usersLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    {user.user_personal_id && (
                      <span className="text-xs text-muted-foreground">
                        #{user.user_personal_id}
                      </span>
                    )}
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground break-all">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{user.country || "N/A"}</span>
                  </div>
                  <p className="text-muted-foreground">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleOpenUserInfo(user)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  See User Info
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">User</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[100px]">Country</TableHead>
                    <TableHead className="min-w-[100px]">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name}
                        {user.user_personal_id && (
                          <span className="text-xs text-muted-foreground ml-2">
                            #{user.user_personal_id}
                          </span>
                        )}
                        <Badge className={`${getRoleColor(user.role)} ml-2`}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="break-all">{user.email}</TableCell>
                      <TableCell>{user.country || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenUserInfo(user)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          See User Info
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <UserInfoDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default UserManagement;
