package main

import (
	"context"
	"fmt"
	"os/exec"
	goruntime "runtime"
	"strings"
	"time"

	"github.com/gen2brain/beeep"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	ERROR_TEXT = "Zielhost nicht erreichbar"
)

var (
	internalIP string = "192.168.178.1"
	pingCount  int    = 30
	myCtx      context.Context
)

func (a *App) SetPingCount(newPingCount int) {
	pingCount = newPingCount
}

func (a *App) GetPingCount() int {
	return pingCount
}

func (a *App) SetInternalIP(newIP string) {
	internalIP = newIP
}

func (a *App) GetInternalIP() string {
	return internalIP
}

// App struct
type App struct {
	ctx context.Context
}

// PingResult struct
type PingResult struct {
	Time       string `json:"time"`
	InternalIP string `json:"internalIP"`
	Output     string `json:"output"`
	Success    bool   `json:"success"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) getTimeHHMMSS() string {
	now := time.Now()
	return fmt.Sprintf("%02d:%02d:%02d", now.Hour(), now.Minute(), now.Second())
}

func (a *App) startup(ctx context.Context) {
	myCtx = ctx
	a.ctx = ctx

	// call the ping function to get the internal IP at startup
	go a.startPinging(ctx)
}

func (a *App) SendDesktopNotification(title string, body string) {
	beeep.Notify(title, body, "")
}

func (a *App) startPinging(ctx context.Context) {
	// Initial delay of 3 seconds
	time.Sleep(3 * time.Second)

	// Initial request
	pingResult := a.ping()
	runtime.EventsEmit(ctx, "pingResult", pingResult)

	for {
		select {
		case <-ctx.Done():
			// Context is done, exit the goroutine
			return
		case <-time.After(30 * time.Second):
			pingResult := a.ping()
			runtime.EventsEmit(ctx, "pingResult", pingResult)
		}
	}
}

func (a *App) SendManualPing() {
	go func() {
		pingResult := a.ping()
		runtime.EventsEmit(a.ctx, "pingResult", pingResult)
	}()
}

func preparePingCommand(internalIP string) *exec.Cmd {
	os := goruntime.GOOS
	if os == "windows" {
		return exec.Command("ping", "-n", "1", "-w", "250", internalIP)
	} else {
		// unix
		return exec.Command("ping", "-c", "1", "-W", "0.25", internalIP)
	}
}

func (a *App) ping() PingResult {
	cmd := preparePingCommand(internalIP)
	out, err := cmd.Output()
	output := string(out)

	status := err == nil && !strings.Contains(output, ERROR_TEXT)

	return PingResult{
		Time:       a.getTimeHHMMSS(),
		InternalIP: internalIP,
		Success:    status,
		Output:     output,
	}
}

func (a *App) MakeWindowsTaskIconFlash(title string) {
	_ = FlashWindow(title)
}
