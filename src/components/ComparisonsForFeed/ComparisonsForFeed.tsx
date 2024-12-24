import {FC, useEffect, useMemo, useRef} from "react";
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

    const viewport = useRef<HTMLDivElement>(null);

    const {data, loading} = useQuery<Data, Variables>(COMPARISONS_FOR_FEED, {
        variables: {
            feedId: props.feedId
        },
        pollInterval: 2500,
    });

    const sortedData = useMemo(() =>
            data?.comparisonsForFeed.slice().sort((a, b) =>
                new Date(a.current.created).getTime() - new Date(b.current.created).getTime()),
        [data]);

    useEffect(() => {
        console.log("Scrollllling!")
        viewport.current?.scrollTo({ top: viewport.current!.scrollHeight });
        }, [sortedData]);

    return (
        loading ?
            <Loading/>
            :
            <ScrollArea maw={"800"} viewportRef={viewport}>
                {sortedData && sortedData.map(f => <ComparisonResult update={f}></ComparisonResult>)}
            </ScrollArea>
    );
};

export default ComparisonsForFeed;