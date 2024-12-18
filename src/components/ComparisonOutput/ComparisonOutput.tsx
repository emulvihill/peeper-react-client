import React from 'react';
import classes from './ComparisonOutput.module.css';
import {useQuery} from "@apollo/client";
import {COMPARE_VIDEO_SNAPS} from "../../services/ComparisonService.ts";
import {SnapPair} from "../../models/graphql-models.ts";

interface ComparisonOutputProps {
    snaps?: SnapPair
}

const ComparisonOutput: React.FC<ComparisonOutputProps> = (props: ComparisonOutputProps) => {

    const {data, error, loading} = useQuery(COMPARE_VIDEO_SNAPS, {
        variables: {
            id1: props.snaps?.["0"]?.id,
            id2: props.snaps?.["1"]?.id
        }
    });

    return (
        <div className={classes.container}>

            <div className={classes.output} >
                {loading && "RUNNING COMPARISON..."}
                {error && `Error! ${error}`}
                {data && <textarea
                    className={classes.textArea}
                    value={data?.compareVideoSnapsById}
                    readOnly
                    rows={5}
                />}
            </div>
        </div>
    );
};

export default ComparisonOutput;