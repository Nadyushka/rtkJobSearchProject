import React, {useEffect, useState} from 'react';
import {Search} from 'tabler-icons-react';
import {Button, Container, Pagination, Text, TextInput} from '@mantine/core';
import {LoaderComponent} from "../../../../../c2-commonComponents/loader/Loader";
import {ErrorComponent} from "../../../../../c2-commonComponents/error/ErrorComponent";
import {VacancyItem} from "../../../../../c2-commonComponents/vacancyItem/VacancyItem";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {vacanciesActions, vacanciesThunks} from "2-BLL/vacancyReducer/vacanciesReducer";
import {
    errorVacancies,
    isLoadingVacancies,
    jobAreaVacancies,
    keyWordVacancies,
    pageCountVacancies,
    paymentFromVacancies,
    paymentToVacancies,
    vacanciesDataVacancies
} from "2-BLL/vacancyReducer/vacancySelectors";
import {useStyles} from "./styleJobOffers";

export const JobOffers = () => {

    const dispatch = useAppDispatch()
    const vacancies = useAppSelector(vacanciesDataVacancies).objects
    const error = useAppSelector(errorVacancies)
    const isLoading = useAppSelector(isLoadingVacancies)
    const totalVacancies = useAppSelector(vacanciesDataVacancies).total
    const pagesCount = useAppSelector(pageCountVacancies)
    const paymentFrom = useAppSelector(paymentFromVacancies)
    const paymentTo = useAppSelector(paymentToVacancies)
    const jobArea = useAppSelector(jobAreaVacancies)
    const kewWord = useAppSelector(keyWordVacancies)

    const [activePage, setPage] = useState<number>(1);
    const totalPages = totalVacancies / pagesCount
    const [kewWordValue, setKewWordValue] = useState<string>(kewWord)

    const {classes, cx} = useStyles();

    const keyWordInputDataAttribute = {'data-elem': 'search-input'}
    const useKeyWordDataAttribute = {'data-elem': 'search-button'}

    const pageOnClickHandler = () => {
        dispatch(vacanciesActions.setFilters({
            keyWord: kewWordValue,
            payment_from: paymentFrom,
            payment_to: paymentTo,
            catalogues: jobArea
        }))
    }

    useEffect(() => {
        if (jobArea.length !== 0) {
            dispatch(vacanciesThunks.setFiltredVacanciesData({
                currentPage: activePage,
                count: pagesCount,
                published: 1,
                keyWord: kewWordValue,
                payment_from: paymentFrom,
                payment_to: paymentTo,
                catalogues: jobArea
            }))
        } else {
            dispatch(vacanciesThunks.setCatalogueData())
            dispatch(vacanciesThunks.setVacanciesData({currentPage: activePage, count: pagesCount}))
        }
        kewWord === '' && setKewWordValue('')
    }, [activePage, paymentFrom, paymentTo, jobArea, kewWord])

    if (isLoading) {
        return <LoaderComponent/>
    }

    return (
        <Container className={classes.jobSearchContainer}>
            <TextInput className={classes.inputJobName}
                       value={kewWordValue}
                       onChange={(e) => setKewWordValue(e.currentTarget.value)}
                       size={'lg'}
                       placeholder="Введите название вакансии"
                       icon={<Search size="1rem"/>}
                       rightSection={
                           <Button size="sm"
                                   onClick={pageOnClickHandler}
                                   {...useKeyWordDataAttribute}>
                               Поиск
                           </Button>}
                       {...keyWordInputDataAttribute}
            />
            {vacancies.length > 0 && vacancies.map(({
                                                        id,
                                                        profession,
                                                        payment_from,
                                                        currency,
                                                        type_of_work,
                                                        town,
                                                        marked
                                                    }) => {
                return (
                    <VacancyItem key={id} id={id} professionName={profession}
                                 payment_from={payment_from}
                                 currency={currency}
                                 type_of_work={type_of_work.title}
                                 town={town.title}
                                 marked={marked} showSelectedVacancy={false}/>
                )
            })}
            {vacancies.length > 0 &&
                <Pagination className={classes.jobSearchPagination}
                            value={activePage}
                            onChange={setPage}
                            onClick={pageOnClickHandler}
                            total={totalPages}/>}

            {vacancies.length === 0 &&
                <Text className={classes.jobSearchNotFound}>Совпадений по заданному набору фильтров нет</Text>}

            <ErrorComponent errorMessage={error} setError={vacanciesActions.setError}/>

        </Container>
    );
};

