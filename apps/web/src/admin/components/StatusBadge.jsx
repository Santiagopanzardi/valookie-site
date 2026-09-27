import { Badge } from '@/components/ui/badge.jsx';
import { STATUS_OPTIONS } from '@/admin/lib/constants';

export function StatusBadge({ status }) {
  const config = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  return <Badge className={config.color}>{config.label}</Badge>;
}
