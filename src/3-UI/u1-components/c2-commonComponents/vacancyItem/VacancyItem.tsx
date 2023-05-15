import React, {FC, useEffect} from 'react';
import {MouseEvent, useState} from 'react';
import {Box, Container, Text, Title} from "@mantine/core";
import selectedStar from '3-UI/u2-assets/pictures/selectedStar.svg'
import notSelectedStar from '3-UI/u2-assets/pictures/notSelectedStar.svg'
import locationIcon from '3-UI/u2-assets/pictures/locationIcon.svg'
import {useNavigate} from "react-router-dom";
import {selectedVacanciesThunks} from "2-BLL/selectedVacanciesSlice/selectedVacanciesSlice";
import {useAppDispatch, useAppSelector} from "2-BLL/store";
import {useStyles} from "./styleVacancyItem";
import {
    currentPageSelectedVacancies,
    pageCountSelectedVacancies
} from "2-BLL/selectedVacanciesSlice/selectedVacancies.selectors";

type PropsType = {
    id: number
    professionName: string
    payment_from: number | ""
    type_of_work: string
    town: string
    marked: boolean,
    showSelectedVacancy: boolean
    currency: 'rub' | 'uah' | 'uzs'
}

export const VacancyItem: FC<PropsType> = ({
                                               id, professionName,
                                               payment_from,
                                               currency,
                                               type_of_work,
                                               town,
                                               marked,
                                               showSelectedVacancy
                                           }) => {


    const dispatch = useAppDispatch()
    const currentPage = useAppSelector(currentPageSelectedVacancies)
    const count = useAppSelector(pageCountSelectedVacancies)

    const navigate = useNavigate()

    const onClickVacancyHandler = () => navigate(`/selectedVacancy/${id}`);

    const [mark, setMark] = useState<boolean>(false)

    const toggleSelectVacancies = (e: MouseEvent<HTMLImageElement>) => {
        if (showSelectedVacancy) {
            dispatch(selectedVacanciesThunks.removeVacancyFromSelection({id, currentPage, count}))
        }
        if (!marked) {
            dispatch(selectedVacanciesThunks.addVacancyToSelected({
                id,
                profession: professionName,
                payment_from,
                currency,
                type_of_work,
                town
            }))
        }
        if (!showSelectedVacancy && marked) {
            dispatch(selectedVacanciesThunks.removeVacancyFromSelection({id, currentPage, count}))
        }
        e.stopPropagation();
        setMark(!mark)
    }

    const {classes, cx} = useStyles();

    const vacancyIdDataAttribute = {'data-elem': `vacancy-${id}`}

    useEffect(() => {
        setMark(marked)
    }, [marked])

    return (
        <Container className={classes.vacancyItemContainer} onClick={onClickVacancyHandler} {...vacancyIdDataAttribute}>
            <Box className={classes.vacancyItemInfo}>
                <Title className={classes.vacancyItemContainerTitle} order={3}>{professionName}</Title>
                <img className={classes.vacancyItemSelectImg}
                     src={mark ? selectedStar : notSelectedStar}
                     onClick={toggleSelectVacancies}
                     data-elem={`vacancy-${id}-shortlist-button`}
                />
            </Box>
            <Text className={classes.vacancyItemDescription} span>
                {payment_from !== 0 ? `з/п от ${payment_from} ${currency}` : 'з/п не указана'}
                <div/>
                <Text span>{type_of_work}</Text>
            </Text>
            <Box className={classes.vacancyItemInfoPlace}>
                <img src={locationIcon}/>
                <Text>{town}</Text>
            </Box>
        </Container>
    );
};


