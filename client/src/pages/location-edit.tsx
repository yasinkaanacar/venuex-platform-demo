import { useParams } from 'wouter';
import LocationEditForm from '@/components/locations2/LocationEditForm';

export default function LocationEdit() {
  const { id } = useParams<{ id: string }>();
  return <LocationEditForm mode="edit" locationId={id} />;
}
