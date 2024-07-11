package main

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gen2brain/beeep"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	ERROR_TEXT = "Zielhost nicht erreichbar"
)

var (
	internalIP   string = "192.168.178.1"
	internalPort string = "80"
	pingCount    int    = 30
	errorCount   int    = 0
	mutex        sync.Mutex
)

func (a *App) GetErrorCount() int {
	return errorCount
}

func (a *App) ErrorCountLessThanFive() bool {
	return errorCount < 5
}

func (a *App) IncrementErrorCount() {
	mutex.Lock()
	defer mutex.Unlock()
	errorCount++
}

func (a *App) ResetErrorCount() {
	mutex.Lock()
	defer mutex.Unlock()
	errorCount = 0
}

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

func (a *App) SetInternalPort(newPort string) {
	internalPort = newPort
}

func (a *App) GetInternalPort() string {
	return internalPort
}

// App struct
type App struct {
	ctx context.Context
}

// PingResult struct
type PingResult struct {
	Time         string `json:"time"`
	InternalIP   string `json:"internalIP"`
	Output       string `json:"output"`
	ErrorCount   int    `json:"errorCount"`
	Notification bool   `json:"notification"`
	Reset        bool   `json:"reset"`
	Success      bool   `json:"success"`
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
		case <-time.After(10 * time.Second):
			pingResult := a.ping()
			runtime.EventsEmit(ctx, "pingResult", pingResult)
		}
	}
}

func (a *App) SendManualPing() {
	pingResult := a.ping()
	runtime.EventsEmit(a.ctx, "pingResultManual", pingResult)
}

func (a *App) SendManualCurl() {
	a.curl()
}

func (a *App) curl() {
	cmd := SendCurl(internalIP, internalPort)
	_, _ = cmd.Output()
}

func (a *App) ping() PingResult {
	if errorCount >= 5 {
		a.ResetErrorCount()
		return PingResult{
			ErrorCount:   errorCount,
			Time:         a.getTimeHHMMSS(),
			Reset:        true,
			Notification: true,
			InternalIP:   internalIP,
			Success:      false,
			Output:       "Error count exceeded 5",
		}
	}

	cmd := SendPing(internalIP)
	out, err := cmd.Output()
	output := string(out)

	status := err == nil && !strings.Contains(output, ERROR_TEXT)

	if !status {
		a.IncrementErrorCount()
	} else {
		a.ResetErrorCount()
	}

	return PingResult{
		ErrorCount:   errorCount,
		Time:         a.getTimeHHMMSS(),
		Reset:        false,
		Notification: false,
		InternalIP:   internalIP,
		Success:      status,
		Output:       output,
	}
}

func (a *App) MakeWindowsTaskIconFlash(title string) {
	_ = FlashWindow(title)
}
