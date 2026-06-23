import { useState } from "react";
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
      main: "#d32f2f", // Festive Red
    },
    secondary: {
      main: "#ffb300", // Gold
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
          boxShadow: "0 2px 8px 0 rgba(211, 47, 47, 0.2)", // 减小了阴影
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)", // 减小了悬停阴影
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
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  
  // Validation state
  const [nameError, setNameError] = useState("");
  const [guestsError, setGuestsError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Custom Validation
    let isValid = true;
    if (!name.trim()) {
      setNameError("麻烦您留下尊姓大名哦～");
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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          // A festive red gradient background
          background: "linear-gradient(135deg, #fff0f0 0%, #ffebee 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(211,47,47,0.1) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,179,0,0.15) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          
          {/* 照片预留位置 (从上到下排列，每一张单独一块) */}
          {[1, 2, 3].map((item) => (
            <Paper
              key={item}
              elevation={0}
              sx={{
                width: "100%",
                height: { xs: 450, sm: 600 },
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "2px dashed #ffcdd2",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d32f2f",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 10px 40px rgba(211,47,47,0.1)",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold", letterSpacing: 1, textAlign: "center" }}>
                照片预留位 {item}
                <br/>
                <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>(建议竖版照片)</span>
              </Typography>
            </Paper>
          ))}

          {/* 邀请函表单部分放在最下面 */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              textAlign: "center",
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(211,47,47,0.2)",
              boxShadow: "0 10px 40px rgba(211,47,47,0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#d32f2f",
                mb: 1,
                fontFamily: '"Helvetica Neue", sans-serif',
                letterSpacing: 2,
                fontWeight: "bold",
              }}
            >
              WEDDING BANQUET
            </Typography>

            <Typography variant="h3" component="h1" gutterBottom>
              答谢宴邀请函
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 3,
              }}
            >
              <Divider sx={{ width: "20%", borderColor: "#d32f2f" }} />
              <Typography sx={{ mx: 2, fontSize: "1.5rem", color: "#d32f2f" }}>
                🧧
              </Typography>
              <Divider sx={{ width: "20%", borderColor: "#d32f2f" }} />
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ mb: 4 }}>
              诚挚邀请您出席我们的婚礼答谢宴
            </Typography>

            <Divider sx={{ mb: 4, borderColor: "rgba(211,47,47,0.1)" }} />
            
            <Typography variant="h6" sx={{ color: "#d32f2f", mb: 2, fontWeight: "bold" }}>
              期待您的光临
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} noValidate>
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
                sx={{ backgroundColor: "#fff" }}
              />
              <TextField
                fullWidth
                label="赴宴人数 *"
                placeholder="请填写包含您在内的总人数"
                type="tel" // 使用 tel 调起数字键盘
                variant="outlined"
                margin="normal"
                value={guests}
                onChange={(e) => {
                  // 只允许输入数字
                  const val = e.target.value.replace(/\D/g, '');
                  setGuests(val);
                  if (guestsError) setGuestsError("");
                }}
                error={!!guestsError}
                helperText={guestsError}
                InputProps={{ inputProps: { min: 1, pattern: "[0-9]*" } }}
                sx={{ backgroundColor: "#fff", mb: 4 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
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
              sx={{ width: "100%", borderRadius: 2 }}
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
