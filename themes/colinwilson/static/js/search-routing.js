/* global instantsearch */

const router = instantsearch.routers.history({
    windowTitle({ query }) {
        const queryTitle = query ? `Search Results for "${query}"` : 'Search';
        return queryTitle;
    },

    createURL({ qsModule, routeState, location }) {
        const urlParts = location.href.match(/^(.*?)\/articles/);
        const baseUrl = `${urlParts ? urlParts[1] : ''}/`;
        const queryParameters = {};
        if (routeState.query) {
            queryParameters.search = encodeURIComponent(routeState.query);
        }

        const queryString = qsModule.stringify(queryParameters, {
            addQueryPrefix: true,
            arrayFormat: 'repeat'
        });

        console.log(routeState);
        console.log(baseUrl + 'articles/' + queryString);
        return `${baseUrl}articles/${queryString}`;
    },

    parseURL({ qsModule, location }) {
        const { search = '' } = qsModule.parse(
            location.search.slice(1)
        );
        return {
            query: decodeURIComponent(search),
        };
    },
}),

stateMapping = {
    stateToRoute(uiState) {
        const indexUiState = uiState['colinwilson.uk'];
        return {
            query: indexUiState.query
        };
    },

    routeToState(routeState) {
        return {
            ['colinwilson.uk']: {
                query: routeState.query
            },
        };
    },
};

const searchRouting = {
    router,
    stateMapping
};

export default searchRouting;
