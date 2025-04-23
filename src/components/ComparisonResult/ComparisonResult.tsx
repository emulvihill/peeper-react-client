import {Card, Group, Stack, Text} from "@mantine/core";
import {SnapComparison, VideoSnap} from "../../models/graphql-models.ts";
import VideoSnapTile from "../VideoSnapTile/VideoSnapTile.tsx";

const Tile = ({snap}: { snap: VideoSnap }) => <VideoSnapTile snap={snap}
                                                             selectedAsBefore={false} selectedAsAfter={false}
                                                             lastSelected={false} onSelected={() => {
}}></VideoSnapTile>

export const ComparisonResult = ({update}: { update: SnapComparison }) =>
    <Card shadow="sm" padding="lg" m="md" radius="md" withBorder>
        <Card.Section>
            <Group wrap="nowrap">
                <Stack w="300">
                    <Group wrap="nowrap">
                        <Tile snap={update.previous!}></Tile>
                        <Tile snap={update.current}></Tile></Group>
                    <Text mt="-6px" size="xs">{update.current.created.replace(/[TZ]/g, " ")}</Text>
                    <Text mt="-12px" size="xs">Number of people: {update.numPersons}</Text>
                </Stack>
                <Stack w={"430px"}>
                    {update.comparisons.map((item) => (
                        <Text size="sm" c="dimmed">
                            {item}
                        </Text>
                    ))}
                </Stack>
            </Group>
        </Card.Section>

    </Card>
