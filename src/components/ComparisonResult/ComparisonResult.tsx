import {Card, Group, Text, Stack} from "@mantine/core";
import {VideoSnap, VideoUpdate} from "../../models/graphql-models.ts";
import VideoSnapTile from "../VideoSnapTile/VideoSnapTile.tsx";

const Tile = ({snap}: { snap: VideoSnap }) => <VideoSnapTile snap={snap}
                                                             selectedAsBefore={false} selectedAsAfter={false}
                                                             lastSelected={false} onSelected={() => {
}}></VideoSnapTile>

export const ComparisonResult = ({update}: { update: VideoUpdate }) =>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
            <Group>
                <Stack>
                    <Tile snap={update.current}></Tile>
                    <Text size="sm">{update.current.date}</Text>
                </Stack>
                {update.previous && <Stack>
                    <Tile snap={update.previous}></Tile>
                    <Text size="sm">{update.previous.date}</Text>
                </Stack>}
            </Group>
        </Card.Section>

        {update.comparison.map((item) => (
            <Text size="sm" c="dimmed">
                {item}
            </Text>
        ))}

    </Card>
