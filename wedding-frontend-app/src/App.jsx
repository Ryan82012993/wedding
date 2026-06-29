import { useState, useEffect } from "react";
import "./App.css";
import img1 from "./images/img1.jpg";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
} from "@mui/material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#fff5f5",
    },
  },
  typography: {
    fontFamily: '"Georgia", "Times New Roman", serif',
    h3: {
      fontStyle: "italic",
      fontWeight: 600,
      letterSpacing: "0.05em",
      color: "#d32f2f",
    },
    subtitle1: {
      fontFamily: '"Helvetica Neue", "Arial", sans-serif',
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      fontSize: "0.85rem",
      color: "#666",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: "none",
          fontSize: "1.2rem",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          padding: "12px 0",
          background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
          boxShadow: "0 2px 8px 0 rgba(211, 47, 47, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderColor: "#ffcdd2",
          },
          "&:hover fieldset": {
            borderColor: "#d32f2f",
          },
        },
      },
    },
  },
});

function App() {
  const [petals, setPetals] = useState(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1000;
    const fallingCount = Math.floor(width / 25);
    return [...Array(fallingCount)].map(() => ({
      left: `${Math.random() * 100}%`,
      "--fall-duration": `${Math.random() * 4 + 4}s`,
      "--sway-duration": `${Math.random() * 2 + 2}s`,
      "--fall-delay": `${Math.random() * 5}s`,
      "--sway-delay": `${Math.random() * 5}s`,
      width: `${Math.random() * 10 + 10}px`,
      height: `${Math.random() * 10 + 10}px`,
    }));
  });

  const [accumulatedPetals, setAccumulatedPetals] = useState(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1000;
    const accumulatedCount = Math.floor(width / 6);
    return [...Array(accumulatedCount)].map(() => ({
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 30 - 10}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
      width: `${Math.random() * 12 + 10}px`,
      height: `${Math.random() * 12 + 10}px`,
      opacity: Math.random() * 0.4 + 0.6,
    }));
  });

  useEffect(() => {
    const calculatePetalCount = () => {
      const width = window.innerWidth;
      const fallingCount = Math.floor(width / 25);
      const accumulatedCount = Math.floor(width / 6);

      setPetals(
        [...Array(fallingCount)].map(() => ({
          left: `${Math.random() * 100}%`,
          "--fall-duration": `${Math.random() * 4 + 4}s`,
          "--sway-duration": `${Math.random() * 2 + 2}s`,
          "--fall-delay": `${Math.random() * 5}s`,
          "--sway-delay": `${Math.random() * 5}s`,
          width: `${Math.random() * 10 + 10}px`,
          height: `${Math.random() * 10 + 10}px`,
        })),
      );

      setAccumulatedPetals(
        [...Array(accumulatedCount)].map(() => ({
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 30 - 10}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
          width: `${Math.random() * 12 + 10}px`,
          height: `${Math.random() * 12 + 10}px`,
          opacity: Math.random() * 0.4 + 0.6,
        })),
      );
    };

    window.addEventListener("resize", calculatePetalCount);
    return () => window.removeEventListener("resize", calculatePetalCount);
  }, []);

  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [nameError, setNameError] = useState("");
  const [guestsError, setGuestsError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!name.trim()) {
      setNameError("麻烦您留下姓名哦～");
      isValid = false;
    }
    if (!guests || parseInt(guests, 10) < 1) {
      setGuestsError("请告诉我们有几位贵宾赴宴～");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post("/api/rsvps", {
        name: name,
        numberOfGuests: parseInt(guests, 10),
      });

      if (response.status === 200) {
        setMessage("期待您的到来！");
        setSeverity("success");
        setName("");
        setGuests("");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("提交失败，请检查网络或后端服务是否启动。");
      setSeverity("error");
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <Box className="bg-decoration-1" />
        <Box className="bg-decoration-2" />

        <Box className="hero-section">
          <img
            src={img1}
            alt="新郎新娘撒花背景"
            className="hero-background-image"
          />
          <Box className="hero-overlay" />
          <img
            src={img1}
            alt="新郎新娘撒花"
            className="hero-foreground-image"
          />
          <Box className="petal-container">
            {petals.map((style, i) => (
              <Box key={`fall-${i}`} className="petal" sx={style} />
            ))}
            {accumulatedPetals.map((style, i) => (
              <Box
                key={`acc-${i}`}
                sx={{
                  position: "absolute",
                  background:
                    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  borderRadius: "15px 0px 15px 0px",
                  ...style,
                }}
              />
            ))}
          </Box>
        </Box>

        <Container maxWidth="sm" className="content-container">
          {[2, 3].map((item) => (
            <Paper key={item} className="photo-placeholder">
              <Typography className="photo-placeholder-text">
                照片预留位 {item}
                <br />
                <span>(建议竖版照片)</span>
              </Typography>
            </Paper>
          ))}

          <Paper className="invitation-card">
            <Typography className="invitation-title-cn">
              答谢宴邀请函
            </Typography>

            <Box className="decorator-row">
              <Divider className="divider-short" />
              <Typography className="decorator-emoji">🧧</Typography>
              <Divider className="divider-short" />
            </Box>

            <Typography variant="subtitle1" className="invitation-text">
              诚挚邀请您出席我们的婚礼答谢宴
            </Typography>

            <Box className="info-box">
              <Typography className="info-row">
                <span className="info-emoji">📅</span>
                <strong>时间：</strong> 9 月 12 日 晚上 18 点
              </Typography>
              <Typography className="info-row">
                <span className="info-emoji">📍</span>
                <strong>地点：</strong> 新福彩海鲜酒家
              </Typography>
            </Box>

            <Divider className="divider-light" />

            <Typography variant="h6" className="expect-title">
              期待您的光临
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              className="rsvp-form"
              noValidate
            >
              <TextField
                fullWidth
                label="宾客姓名 *"
                placeholder="请输入您的姓名"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                error={!!nameError}
                helperText={nameError}
                className="form-input"
              />
              <TextField
                fullWidth
                label="赴宴人数 *"
                placeholder="请填写包含您在内的总人数"
                type="tel"
                variant="outlined"
                margin="normal"
                value={guests}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setGuests(val);
                  if (guestsError) setGuestsError("");
                }}
                error={!!guestsError}
                helperText={guestsError}
                InputProps={{ inputProps: { min: 1, pattern: "[0-9]*" } }}
                className="form-input-guests"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                className="submit-button"
              >
                确认出席
              </Button>
            </Box>
          </Paper>

          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity={severity}
              className="snackbar-content"
            >
              {message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
