import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User, Shield } from 'lucide-react';
import usersData from '@/data/users.json';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export default function PermissionManagementPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(usersData as User[]);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t('sidebar.permissionsManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-1 relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('navbar.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <Card 
                key={user.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/permissions-management/${user.id}`)}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <Shield className="w-4 h-4" />
                    <span>{user.permissions.length} Permissions</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 