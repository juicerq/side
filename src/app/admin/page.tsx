import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>Admins only.</CardDescription>
        </CardHeader>
        <CardContent>Contente</CardContent>
      </Card>
    </div>
  );
}
