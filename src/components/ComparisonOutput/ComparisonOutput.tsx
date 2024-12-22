import {FC} from "react";
import {useQuery} from "@apollo/client";
import {COMPARE_VIDEO_SNAPS} from "../../services/ComparisonService.ts";
import {SnapPair, SnapComparison} from "../../models/graphql-models.ts";
import {Loading} from "../Loading/Loading.tsx";
import {ScrollArea} from "@mantine/core";
import {ComparisonResult} from "../ComparisonResult/ComparisonResult.tsx";

interface ComparisonOutputProps {
    snaps?: SnapPair
}

interface Data {
    compareVideoSnapsById: SnapComparison
}

interface Variables {
    id1?: string;
    id2?: string;
}

export const ComparisonOutput: FC<ComparisonOutputProps> = (props: ComparisonOutputProps) => {

    const {data, loading, error} = useQuery<Data, Variables>(COMPARE_VIDEO_SNAPS, {
        variables: {
            id1: props.snaps?.["0"]?.id,
            id2: props.snaps?.["1"]?.id
        }
    });

    return (
        loading ?
            <Loading/>
            :
            <ScrollArea h={250}>
                {error ? `Error! ${error}` : data && <ComparisonResult update={data.compareVideoSnapsById}></ComparisonResult>}
            </ScrollArea>
    );
};

export default ComparisonOutput;