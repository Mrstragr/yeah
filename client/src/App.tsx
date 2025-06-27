import { ProductionReadyPlatform } from './components/ProductionReadyPlatform';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductionReadyPlatform />
      <Toaster />
    </QueryClientProvider>
  );
}