import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SplashScreen from "@/pages/SplashScreen";

function Router() {
  return (
    <Switch>
      <Route path="/welcome" component={SplashScreen} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
