import {Card, Group, Text, Stack} from "@mantine/core";
import {VideoSnap, SnapComparison} from "../../models/graphql-models.ts";
import VideoSnapTile from "../VideoSnapTile/VideoSnapTile.tsx";

const Tile = ({snap}: { snap: VideoSnap }) => <VideoSnapTile snap={snap}
                                                             selectedAsBefore={false} selectedAsAfter={false}
                                                             lastSelected={false} onSelected={() => {
}}></VideoSnapTile>

export const ComparisonResult = ({update}: { update: SnapComparison }) =>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
            <Group wrap="nowrap">
                <Stack>
                    <Tile snap={update.current}></Tile>
                    <Text mt="-6px" size="xs">{update.current.created.replace(/[TZ]/g, " ")}</Text>
                    <Text mt="-12px" size="xs">Number of people: {update.numPersons}</Text>
                </Stack>
                <Stack>
                    {update.comparisons.map((item) => (
                        <Text size="sm" c="dimmed">
                            {item}
                        </Text>
                    ))}
                </Stack>
            </Group>
        </Card.Section>

    </Card>
