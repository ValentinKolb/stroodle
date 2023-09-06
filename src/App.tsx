import {Text} from '@mantine/core'
import {Switch, Link, Route} from "wouter"
import Login from "./sites/Login";
import NotFound from "./sites/NotFound";
import Test from "./sites/test";

function App() {

    return <Switch>
        <Route path="/">
            <Login/>
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
