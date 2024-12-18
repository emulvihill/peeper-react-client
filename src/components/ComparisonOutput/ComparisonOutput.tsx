import React from 'react';
import classes from './ComparisonOutput.module.css';
import {useQuery} from "@apollo/client";
import {COMPARE_VIDEO_SNAPS} from "../../services/ComparisonService.ts";
import {SnapPair} from "../../models/graphql-models.ts";

interface ComparisonOutputProps {
    snaps?: SnapPair
}

const ComparisonOutput: React.FC<ComparisonOutputProps> = (props: ComparisonOutputProps) => {

    const {
        data: comparisonData,
        error: comparisonError,
        loading: comparisonLoading
    } = useQuery(COMPARE_VIDEO_SNAPS, {variables: {id1: props.snaps?.["0"]?.id, id2: props.snaps?.["1"]?.id}});

    return (
        <div className={classes.container}>
            {comparisonLoading && (
                <div className={classes.loading}>RUNNING COMPARISON...</div>
            )}
            {comparisonError && (
                <div className={classes.error}>
                    ERROR: {comparisonError?.cause?.message}
                </div>
            )}
            {comparisonData && (
                <div className={classes.output}>
                    <textarea
                        className={classes.textArea}
                        value={comparisonData?.compareVideoSnapsById}
                        readOnly
                        rows={5}
                    />
                </div>
            )}
        </div>
    );
};

export default ComparisonOutput;