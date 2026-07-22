import { redirect } from 'next/navigation';

export default function FileManagerRoot() {
  redirect('/filemanager/dashboard');
}
