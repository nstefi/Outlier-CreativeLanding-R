import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ParticleDemo from "@/pages/ParticleDemo";
import ConferenceBackground from "@/pages/ConferenceBackground";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/animation-test" component={ParticleDemo} />
      <Route path="/conference" component={ConferenceBackground} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
