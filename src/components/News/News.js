import React, {useEffect, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import NullImage from "../../components/Images/nullImage.png";
import Loading from "../Loading/Loading";
import NewsItem from "../NewsItem/NewsItem";
import {v4 as uuidv4} from "uuid";
import {Col, Row} from "react-bootstrap";
import {header} from "../../config/config";
import {endpointPath} from "../../config/api";
import {Container, Header, card} from "./index";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ITEMS_PER_PAGE = 5;

function News(props) {
    const {newscategory, country} = props;
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const category = newscategory;
    const title = capitalize(category);
    document.title = `${capitalize(title)} - News`;

    const updateNews = async () => {
        try {
            const response = await axios.get(endpointPath(country, category));
            setLoading(true);
            const parsedData = response.data;
            setArticles(parsedData.articles);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        updateNews();
        // eslint-disable-next-line
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const paginatedArticles = articles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (<>
            {loading ? (<Loading/>) : (<>
                    <Header>{header(capitalize(category))}</Header>
                    <Container>
                        <Row>
                            {paginatedArticles.map((element) => (
                                <Col sm={12} md={6} lg={4} xl={3} style={card} key={uuidv4()}>
                                    <NewsItem
                                        title={element.title}
                                        description={element.description}
                                        published={element.publishedAt}
                                        channel={element.source.name}
                                        alt="News image"
                                        publishedAt={element.publishedAt}
                                        imageUrl={element.image === null ? NullImage : element.image}
                                        urlNews={element.url}
                                    />
                                </Col>))}
                        </Row>
                        <Stack spacing={2} sx={{mt: 2, mb: 2, alignItems: "center"}}>
                            <Pagination
                                count={Math.ceil(articles.length / ITEMS_PER_PAGE)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{
                                    color: "white", '& .MuiPaginationItem-root': {
                                        color: 'white'
                                    }, '& .Mui-selected': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                                    }, '& .MuiPaginationItem-root.Mui-selected': {
                                        color: 'white',
                                    },
                                }}
                            />
                        </Stack>
                    </Container>
                </>)}
        </>);
}

News.defaultProps = {
    country: "in", newscategory: "general",
};

News.propTypes = {
    country: PropTypes.string, newscategory: PropTypes.string,
};

export default News;