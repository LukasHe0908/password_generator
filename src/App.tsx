import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function App() {
  document.title = '密码生成器';
  const characterSetOfThePassword = {
    number: '0123456789',
    lowerCaseLetter: 'abcdefghijklmnopqrstuvwxyz',
    upperCaseLetter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    specialSymbol: ':`~!@#$%^&*()_+-={}|[]\\:"";\'<>?,./',
    specialSymbolOrigin: '~!@#$%^&*()_+',
  };
  const [quantity, setQuantity] = useState(5);
  const [singleLength, setSingleLength] = useState(false);
  const [lengthMin, setLengthMin] = useState(16);
  const [lengthMax, setLengthMax] = useState(20);
  const [characterSet, setCharacterSet] = useState('');
  const [characterSetFinished, setCharacterSetFinished] = useState(false);
  const [quickCopy, setQuickCopy] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    try {
      let config: any = localStorage.getItem('password_generator');
      if (!config) {
        setCharacterSetFinished(true);
        return;
      }
      config = JSON.parse(config);
      if (config.quantity) {
        setQuantity(parseInt(config.quantity));
      }
      if (config.singleLength) {
        setSingleLength(config.singleLength);
      }
      if (config.lengthMin) {
        setLengthMin(parseInt(config.lengthMin));
      }
      if (config.lengthMax) {
        setLengthMax(parseInt(config.lengthMax));
      }
      if (config.characterSet) {
        setCharacterSet(config.characterSet);
      }
      if (config.quickCopy) {
        setQuickCopy(config.quickCopy);
      }
    } catch {}
    setCharacterSetFinished(true);
  }, []);
  function storeConfig(key: string, value: any) {
    let config: any = localStorage.getItem('password_generator');
    try {
      config = JSON.parse(config);
    } catch (err: any) {
      console.warn(err);
      config = {};
    }
    if (!config) config = {};
    config[key] = value;
    // console.log(config);
    localStorage.setItem('password_generator', JSON.stringify(config));
  }
  useEffect(() => {
    storeConfig('quantity', quantity);
  }, [quantity]);
  useEffect(() => {
    storeConfig('singleLength', singleLength);
  }, [singleLength]);
  useEffect(() => {
    storeConfig('lengthMin', lengthMin);
  }, [lengthMin]);
  useEffect(() => {
    storeConfig('lengthMax', lengthMax);
  }, [lengthMax]);
  useEffect(() => {
    storeConfig('characterSet', characterSet);
  }, [characterSet]);
  useEffect(() => {
    storeConfig('quickCopy', quickCopy);
  }, [quickCopy]);

  return (
    <Container
      style={{
        padding: 0,
        height: '100%',
      }}
    >
      <Title></Title>
      <ContentCard>
        <Stack spacing={2}>
          <FunctionQuantity
            use={quantity}
            set={(value: string) => {
              if (value.length > 0 && Number(value) > 0) {
                setQuantity(Number(value));
              }
            }}
          ></FunctionQuantity>
          <Divider />
          <FunctionLength
            single={singleLength}
            setSingle={setSingleLength}
            useMin={lengthMin}
            useMax={lengthMax}
            setMin={(value: string) => {
              if (value.length > 0 && Number(value) > 0) {
                if (value.length > 0 && Number(value) > 0) {
                  setLengthMin(Number(value));
                }
              }
            }}
            setMax={(value: string) => {
              if (value.length > 0 && Number(value) > 0) {
                if (value.length > 0 && Number(value) > 0) {
                  setLengthMax(Number(value));
                }
              }
            }}
          ></FunctionLength>
          <Divider />
          <FunctionCharacterSet
            characterSetOfThePassword={characterSetOfThePassword}
            use={characterSet}
            set={setCharacterSet}
            finished={characterSetFinished}
          ></FunctionCharacterSet>
          <Divider />
          <FunctionGenerate
            onClick={() => {
              let max = lengthMax;
              if (singleLength) max = lengthMin;
              let text = '';
              for (let i = 1; i <= quantity; i++) {
                text += generateOne(characterSet, lengthMin, max);
                if (i < quantity) text += '\n';
              }
              // console.log(text);
              setResult(text);
            }}
          ></FunctionGenerate>
          <Divider />
          <FunctionResult
            use={result}
            set={setResult}
            quickCopy={quickCopy}
            setQuickCopy={setQuickCopy}
          ></FunctionResult>
        </Stack>
      </ContentCard>
    </Container>
  );
}
function Title() {
  return (
    <div
      style={{
        padding: '0.4em',
      }}
    >
      <Typography variant='h4'>密码生成器</Typography>
    </div>
  );
}
function ContentCard(props: any) {
  return (
    <div style={{ padding: '0 0.4em 0.4em' }}>
      <Card style={{ width: '100%' }}>
        <CardContent style={{ marginTop: '0' }}>{props.children}</CardContent>
      </Card>
    </div>
  );
}
function FunctionList(props: any) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '20%',
          paddingRight: '0.4em',
        }}
      >
        <span
          style={{
            display: 'block',
            textAlign: 'right',
            // whiteSpace: 'nowrap',
            // fontSize: '1.2em',
          }}
        >
          {props.describe}
        </span>
      </div>
      <div style={{ width: '100%' }}>{props.children}</div>
    </div>
  );
}
function ResultTextarea(props: any) {
  const StyledTextarea: any = useMemo(() => {
    const blue = {
      100: '#DAECFF',
      200: '#b6daff',
      400: '#3399FF',
      500: '#007FFF',
      600: '#0072E5',
      900: '#003A75',
    };
    const grey = {
      50: '#f6f8fa',
      100: '#eaeef2',
      200: '#d0d7de',
      300: '#afb8c1',
      400: '#8c959f',
      500: '#6e7781',
      600: '#57606a',
      700: '#424a53',
      800: '#32383f',
      900: '#24292f',
    };
    return styled(TextareaAutosize)(
      ({ theme }) => `
      width: 320px;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 12px;
      border-radius: 12px;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${
        theme.palette.mode === 'dark' ? grey[700] : grey[200]
      };
      box-shadow: 0px 2px 2px ${
        theme.palette.mode === 'dark' ? grey[900] : grey[50]
      };
    
      &:hover {
        border-color: ${blue[400]};
      }
    
      &:focus {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 3px ${
          theme.palette.mode === 'dark' ? blue[500] : blue[200]
        };
      }
    
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
    );
  }, []);

  return (
    <StyledTextarea
      minRows={3}
      maxRows={12}
      placeholder='Empty'
      style={{
        width: '100%',
        resize: 'block',
      }}
      value={props.value}
      onInput={props.onInput}
      onClick={props.onClick}
    />
  );
}
function FunctionQuantity(props: any) {
  return (
    <FunctionList describe='数量：'>
      <Input
        type='number'
        placeholder='Empty'
        style={{ width: '100%' }}
        value={props.use}
        onInput={(evt: any) => {
          props.set(evt.target.value);
        }}
      />
    </FunctionList>
  );
}
function FunctionLength(props: any) {
  return (
    <FunctionList describe='长度：' style>
      <FormControlLabel
        control={
          <Checkbox
            checked={props.single}
            onClick={() => {
              props.setSingle(!props.single);
            }}
          />
        }
        label='单一长度'
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Input
          type='number'
          placeholder='Empty'
          style={{ width: '100%' }}
          value={props.useMin}
          onInput={(evt: any) => {
            props.setMin(evt.target.value);
          }}
        />
        <span style={{ padding: '0 0.4em' }}>~</span>
        <Input
          type='number'
          placeholder='Empty'
          style={{ width: '100%' }}
          value={props.useMax}
          onInput={(evt: any) => {
            props.setMax(evt.target.value);
          }}
          disabled={props.single}
        />
      </div>
    </FunctionList>
  );
}
function FunctionCharacterSet(props: any) {
  const [string, setString] = useState('');
  const [checkedNumber, setCheckedNumber] = useState(true);
  const [checkedLowerCaseLetter, setCheckedLowerCaseLetter] = useState(true);
  const [checkedUpperCaseLetter, setCheckedUpperCaseLetter] = useState(true);
  const [checkedSpecialSymbol, setCheckedSpecialSymbol] = useState(true);

  useEffect(() => {
    if (!props.finished) return;
    if (props.use === undefined || props.use === '') {
      replaceInput(
        checkedNumber,
        checkedLowerCaseLetter,
        checkedUpperCaseLetter,
        checkedSpecialSymbol
      );
    } else {
      setString(props.use);
      replaceCheckbox(props.use);
    }
  }, [props.finished]);
  function replaceInput(
    checkedNumber: boolean,
    checkedLowerCaseLetter: boolean,
    checkedUpperCaseLetter: boolean,
    checkedSpecialSymbol: boolean
  ) {
    let tempString = '';
    if (checkedNumber) tempString += props.characterSetOfThePassword.number;
    if (checkedLowerCaseLetter)
      tempString += props.characterSetOfThePassword.lowerCaseLetter;
    if (checkedUpperCaseLetter)
      tempString += props.characterSetOfThePassword.upperCaseLetter;
    if (checkedSpecialSymbol)
      tempString += props.characterSetOfThePassword.specialSymbol;
    setString(tempString);
    props.set(tempString);
  }
  function replaceCheckbox(string: any) {
    if (string.includes(props.characterSetOfThePassword.number)) {
      setCheckedNumber(true);
    } else {
      setCheckedNumber(false);
    }
    if (string.includes(props.characterSetOfThePassword.lowerCaseLetter)) {
      setCheckedLowerCaseLetter(true);
    } else {
      setCheckedLowerCaseLetter(false);
    }
    if (string.includes(props.characterSetOfThePassword.upperCaseLetter)) {
      setCheckedUpperCaseLetter(true);
    } else {
      setCheckedUpperCaseLetter(false);
    }
    if (string.includes(props.characterSetOfThePassword.specialSymbol)) {
      setCheckedSpecialSymbol(true);
    } else {
      setCheckedSpecialSymbol(false);
    }
  }

  return (
    <FunctionList describe='字符集：'>
      <Input
        placeholder='Empty'
        style={{ width: '100%' }}
        value={string}
        onInput={(evt: any) => {
          props.set(evt.target.value);
          setString(evt.target.value);
          replaceCheckbox(evt.target.value);
        }}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedNumber}
              onClick={() => {
                setCheckedNumber(!checkedNumber);
                replaceInput(
                  !checkedNumber,
                  checkedLowerCaseLetter,
                  checkedUpperCaseLetter,
                  checkedSpecialSymbol
                );
              }}
            />
          }
          label={'数字 ' + props.characterSetOfThePassword.number}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedLowerCaseLetter}
              onClick={() => {
                setCheckedLowerCaseLetter(!checkedLowerCaseLetter);
                replaceInput(
                  checkedNumber,
                  !checkedLowerCaseLetter,
                  checkedUpperCaseLetter,
                  checkedSpecialSymbol
                );
              }}
            />
          }
          label={'小写字母 ' + props.characterSetOfThePassword.lowerCaseLetter}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedUpperCaseLetter}
              onClick={() => {
                setCheckedUpperCaseLetter(!checkedUpperCaseLetter);
                replaceInput(
                  checkedNumber,
                  checkedLowerCaseLetter,
                  !checkedUpperCaseLetter,
                  checkedSpecialSymbol
                );
              }}
            />
          }
          label={'大写字母 ' + props.characterSetOfThePassword.upperCaseLetter}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedSpecialSymbol}
              onClick={() => {
                setCheckedSpecialSymbol(!checkedSpecialSymbol);
                replaceInput(
                  checkedNumber,
                  checkedLowerCaseLetter,
                  checkedUpperCaseLetter,
                  !checkedSpecialSymbol
                );
              }}
            />
          }
          label={'特殊符号 ' + props.characterSetOfThePassword.specialSymbol}
        />
      </FormGroup>
    </FunctionList>
  );
}
function FunctionGenerate(props: any) {
  return (
    <FunctionList describe=''>
      <Button variant='contained' onClick={props.onClick}>
        生成
      </Button>
    </FunctionList>
  );
}
function FunctionResult(props: any) {
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const handleCopyClick = (evt: any) => {
    if (!props.quickCopy) return;
    // const row = evt.target.value
    //   .substring(0, evt.target.selectionStart)
    //   .split('\n').length;
    // const lines = evt.target.value.split('\n');
    // const clickedLine = lines[row - 1];
    // navigator.clipboard.writeText(clickedLine);
    let startPos =
      evt.target.value.lastIndexOf('\n', evt.target.selectionStart - 1) + 1;
    let endPos = evt.target.value.indexOf('\n', evt.target.selectionStart);
    if (endPos === -1) {
      endPos = evt.target.value.length;
    }
    evt.target.setSelectionRange(startPos, endPos);
    const res = document.execCommand('copy');
    if (res === true) {
      setShowSnackbar(true);
    }
  };
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <FunctionList describe='结果：'>
      <FormControlLabel
        control={
          <Checkbox
            checked={props.quickCopy}
            onClick={() => {
              props.setQuickCopy(!props.quickCopy);
            }}
          />
        }
        label='快速复制'
      />
      <ResultTextarea
        value={props.use}
        onInput={(evt: any) => {
          props.set(evt.target.value);
        }}
        onClick={handleCopyClick}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
      >
        <Alert severity='success'>复制成功</Alert>
      </Snackbar>
    </FunctionList>
  );
}

function generateOne(charset: string, min: number, max: number) {
  let tempMin = Math.min(min, max);
  let tempMax = Math.max(min, max);
  let result = '';
  if (charset.length > 0 && tempMin > 0 && tempMax > 0) {
    let len = Math.trunc(Math.random() * (tempMax - tempMin) + tempMin);
    while (result.length < len) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  return result;
}
