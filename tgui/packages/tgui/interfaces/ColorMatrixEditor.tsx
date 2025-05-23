import { toFixed } from 'common/math';
import { useBackend } from 'tgui/backend';
import {
  Box,
  Button,
  ByondUi,
  NumberInput,
  Section,
  Stack,
} from 'tgui/components';
import { Window } from 'tgui/layouts';

type Data = {
  mapRef: string;
  currentColor: number[];
};

const PREFIXES = ['r', 'g', 'b', 'a', 'c'] as const;

export const ColorMatrixEditor = (props) => {
  const { act, data } = useBackend<Data>();
  const { mapRef, currentColor } = data;

  return (
    <Window title="Color Matrix Editor" width={600} height={220}>
      <Window.Content>
        <Stack fill>
          <Stack.Item align="center">
            <Stack fill vertical>
              <Stack.Item grow />
              <Stack.Item>
                <Section>
                  <Stack>
                    {[0, 1, 2, 3].map((col, key) => (
                      <Stack.Item key={key}>
                        <Stack vertical>
                          {[0, 1, 2, 3, 4].map((row, key) => (
                            <Stack.Item key={key}>
                              <Box inline textColor="label" width="2.1rem">
                                {`${PREFIXES[row]}${PREFIXES[col]}:`}
                              </Box>
                              <NumberInput
                                minValue={-Infinity}
                                maxValue={+Infinity}
                                value={currentColor[row * 4 + col]}
                                step={0.01}
                                width="50px"
                                format={(value) => toFixed(value, 2)}
                                onDrag={(value) => {
                                  let retColor = currentColor;
                                  retColor[row * 4 + col] = value;
                                  act('transition_color', {
                                    color: retColor,
                                  });
                                }}
                              />
                            </Stack.Item>
                          ))}
                        </Stack>
                      </Stack.Item>
                    ))}
                  </Stack>
                </Section>
              </Stack.Item>
              <Stack.Item grow />
              <Stack.Item align="left">
                <Button.Confirm
                  confirmContent="Confirm?"
                  onClick={() => act('confirm')}
                >
                  Confirm
                </Button.Confirm>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item grow>
            <ByondUi
              height="100%"
              params={{
                id: mapRef,
                type: 'map',
              }}
            />
          </Stack.Item>
        </Stack>
      </Window.Content>
    </Window>
  );
};
