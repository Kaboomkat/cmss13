import { toFixed } from 'common/math';
import type { BooleanLike } from 'common/react';
import { useBackend } from 'tgui/backend';
import {
  Button,
  LabeledControls,
  NoticeBox,
  NumberInput,
  RoundGauge,
  Section,
} from 'tgui/components';
import { formatSiUnit } from 'tgui/format';
import { Window } from 'tgui/layouts';

const formatPressure = (value: number) => {
  if (value < 10000) {
    return toFixed(value) + ' kPa';
  }
  return formatSiUnit(value * 1000, 1, 'Pa');
};

type Data = {
  tankPressure: number;
  tankMaxPressure: number;
  ReleasePressure: number;
  defaultReleasePressure: number;
  maxReleasePressure: number;
  minReleasePressure: number;
  mask_connected: BooleanLike;
  valve_open: BooleanLike;
};

export const Tank = (props) => {
  const { act, data } = useBackend<Data>();

  return (
    <Window width={310} height={150}>
      <Window.Content>
        {(!!data.mask_connected && (
          <NoticeBox success>This tank is connected to a mask.</NoticeBox>
        )) || (
          <NoticeBox danger>This tank is not connected to a mask.</NoticeBox>
        )}
        <Section>
          <LabeledControls>
            <LabeledControls.Item label="Pressure">
              <RoundGauge
                value={data.tankPressure}
                minValue={0}
                maxValue={data.tankMaxPressure}
                format={formatPressure}
                size={2}
              />
            </LabeledControls.Item>
            <LabeledControls.Item label="Pressure Regulator">
              <Button
                icon="fast-backward"
                disabled={data.ReleasePressure === data.minReleasePressure}
                onClick={() =>
                  act('pressure', {
                    pressure: 'min',
                  })
                }
              />
              <NumberInput
                animated
                value={data.ReleasePressure}
                width="65px"
                unit="kPa"
                step={1}
                minValue={data.minReleasePressure}
                maxValue={data.maxReleasePressure}
                onChange={(value) =>
                  act('pressure', {
                    pressure: value,
                  })
                }
              />
              <Button
                icon="fast-forward"
                disabled={data.ReleasePressure === data.maxReleasePressure}
                onClick={() =>
                  act('pressure', {
                    pressure: 'max',
                  })
                }
              />
              <Button
                icon="undo"
                disabled={data.ReleasePressure === data.defaultReleasePressure}
                onClick={() =>
                  act('pressure', {
                    pressure: 'reset',
                  })
                }
              />
            </LabeledControls.Item>
            <LabeledControls.Item label="Valve">
              <Button
                my={0.5}
                width="60px"
                lineHeight={2}
                fontSize="11px"
                disabled={!data.mask_connected}
                color={data.valve_open ? 'danger' : null}
                icon={data.valve_open ? 'lock-open' : 'lock'}
                onClick={() => act('valve')}
              >
                {data.valve_open ? 'Open' : 'Closed'}
              </Button>
            </LabeledControls.Item>
          </LabeledControls>
        </Section>
      </Window.Content>
    </Window>
  );
};
