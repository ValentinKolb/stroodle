import {Text} from '@mantine/core'
import {Switch, Link, Route} from "wouter"
import Login from "./sites/Login";
import NotFound from "./sites/NotFound";
import Register from "./sites/Register";
import Home from "./sites/Home";
import Test from "./sites/test";

function App() {

    return <Switch>
        <Route path="/">
            <Home/>
        </Route>

        <Route path="/login">
            <Login/>
        </Route>

        <Route path="/register">
            <Register/>
        </Route>

        <Route path="/about">
            <Link to="/">Home</Link>
            <Text>About</Text>
        </Route>

        <Route path="/test">
            <Test/>
        </Route>

        <Route>
            <NotFound/>
        </Route>
    </Switch>
}

export default App
