import {FC} from "react";
import {useQuery} from "@apollo/client";
import {COMPARISONS_FOR_FEED} from "../../services/ComparisonService.ts";
import {SnapComparison} from "../../models/graphql-models.ts";
import {Loading} from "../Loading/Loading.tsx";
import {ScrollArea} from "@mantine/core";
import {ComparisonResult} from "../ComparisonResult/ComparisonResult.tsx";

interface ComparisonsForFeedProps {
    feedId: string
}

interface Data {
    comparisonsForFeed: [SnapComparison]
}

interface Variables {
    feedId: string;
}

export const ComparisonsForFeed: FC<ComparisonsForFeedProps> = (props: ComparisonsForFeedProps) => {

    const {data, loading} = useQuery<Data, Variables>(COMPARISONS_FOR_FEED, {
        variables: {
            feedId: props.feedId
        }
    });

    return (
        loading ?
            <Loading/>
            :
            <ScrollArea>
                {data && data.comparisonsForFeed.map(f => <ComparisonResult update={f}></ComparisonResult>)}
            </ScrollArea>
    );
};

export default ComparisonsForFeed;