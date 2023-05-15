import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Box, Container, Title} from "@mantine/core";
import {Filters} from "./j1-jobSearchFiltersAndOffers/v1-filters/Filters";
import {JobOffers} from './j1-jobSearchFiltersAndOffers/v2-jobOffers/JobOffers';
import {useAppSelector} from "2-BLL/store";
import {isAuthorisedAuth} from "2-BLL/authSlice/auth.selectors";
import {PATH} from "../../../c2-commonComponents/routes/Routes";
import {useStyles} from "./styleJobSearch";

export const JobSearch = () => {

    const isAuthorised = useAppSelector(isAuthorisedAuth)

    const navigate = useNavigate()

    const {classes, cx} = useStyles();

    useEffect(() => {
        if (!isAuthorised) {
            navigate(PATH.LOGIN)
        }
    }, [isAuthorised])

    return (
        <Container className={classes.jobSearchContainer}>
            <Title order={1} className={classes.mainTitle}>Job search</Title>
            <Filters/>
            <Box className={classes.jobOffers}>
                <JobOffers/>
            </Box>
        </Container>
    );
};


