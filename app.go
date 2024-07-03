package main

import (
	"context"
	"fmt"
	"os/exec"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var internalIP string = "192.168.178.1"

func (a *App) setInternalIP(newIP string) {
	internalIP = newIP
}

func (a *App) getInternalIP() string {
	return internalIP
}

// App struct
type App struct {
	ctx context.Context
}

// PingResult struct
type PingResult struct {
	InternalIP string `json:"internalIP"`
	Output     string `json:"output"`
	Success    bool   `json:"success"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// call the ping function to get the internal IP at startup
	go a.startPinging(ctx)
}

func (a *App) startPinging(ctx context.Context) {
	for {
		pingResult := a.ping(internalIP)
		runtime.EventsEmit(ctx, "pingResult", pingResult)
		time.Sleep(3 * time.Second)
	}
}

// ping executes the ping command and returns the output
func (a *App) ping(ip string) PingResult {
	out, err := exec.Command("ping", "-c", "1", ip).Output()
	if err != nil {
		return PingResult{
			InternalIP: internalIP,
			Success:    false,
			Output:     fmt.Sprintf("Error: %s", err),
		}
	}
	return PingResult{
		InternalIP: internalIP,
		Success:    true,
		Output:     string(out),
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
