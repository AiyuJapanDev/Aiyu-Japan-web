import ProtectedRoute from '@/components/ProtectedRoute';
import { EditOrder as EditOrderComponent } from '@/components/user/EditOrder';

export default function EditOrder() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <EditOrderComponent />
      </div>
    </ProtectedRoute>
  );
}