import Breadcrumb from '@/components/layouts/breadcrumb';
import { UserMenu } from './user-menu';

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex items-center justify-between p-2 px-4">
        <Breadcrumb />
        <UserMenu />
      </div>
    </nav>
  );
}
