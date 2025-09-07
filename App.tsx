import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import MainMenu from "@/pages/main-menu";
import DrawingAssistant from "@/pages/drawing-assistant";
import LegoCreator from "@/pages/lego-creator";
import Playground from "@/pages/playground";
import Gallery from "@/pages/gallery";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/menu" component={MainMenu} />
      <Route path="/drawing" component={DrawingAssistant} />
      <Route path="/lego" component={LegoCreator} />
      <Route path="/playground" component={Playground} />
      <Route path="/gallery" component={Gallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
