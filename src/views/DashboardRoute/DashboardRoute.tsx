import React from "react"
import {Route,Switch,useRouteMatch,Redirect} from "react-router-dom"
import {DashboardLayout} from "layouts"
import {Home} from "views/Home"
import {PrayerWall} from "views/PrayerWall"
import {Sermon} from "views/Sermon"
import {Profile} from "views/Profile"
import {Giving} from "views/Giving"
import {Reflection} from "views/Reflection"
import {Announcement} from "views/Announcement"
import {Activity} from "views/Activity"
import {Bible} from "views/Bible"
import {Groups} from "views/Groups"
import {LiveStreamView} from "views/Livestream"


const DashboardRoute = () => {
    const {path} = useRouteMatch()

    return(
        <DashboardLayout>
        <Route render={({location}) => {            
            return(
                <Switch location={location}>
                    <Route exact path={`${path}/home`} render={() => (
                        <Home/>
                    )}
                    />
                    <Route exact path={`${path}/prayer`} render={() => (
                        <PrayerWall/>
                    )}
                    />
                    <Route exact path={`${path}/sermon`} render={() => (
                        <Sermon/>
                    )}
                    />
                    <Route exact path={`${path}/livestream/:liveStreamID`} render={() => (
                        <LiveStreamView/>
                    )}
                    />
                    <Route exact path={`${path}/profile`} render={() => (
                        <Profile/>
                    )}
                    />
                    <Route exact path={`${path}/giving`} render={() => (
                        <Giving/>
                    )}
                    />
                    <Route exact path={`${path}/reflection`} render={() => (
                        <Reflection/>
                    )}
                    />
                    <Route exact path={`${path}/announcement`} render={() => (
                        <Announcement/>
                    )}
                    />
                    <Route exact path={`${path}/groups`} render={() => (
                        <Groups/>
                    )}
                    />
                    <Route exact path={`${path}/activity`} render={() => (
                        <Activity/>
                    )}
                    />
                    <Route exact path={`${path}/bible`} render={() => (
                        <Bible/>
                    )}
                    />
                    <Route render={() => <Redirect to={`${path}/home`} />} />
                </Switch>
            )
        }}
        />
    </DashboardLayout>
    )
}

export default DashboardRoute